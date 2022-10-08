;(function(){
	var me={
		appName:'cUpload',
		containerID:'',			//主容器的id
		prefix:'a_',			//class prefix
		cls:{
			file:'',			//uploaderID
			thumb:'',			//clsThumb
			add:'',				//addID
			remove:'',			//removeID
			pre:'',				//imagePre
			sum:'',				//sumID
			ids:'',				//idsID
			max:'',				//maxID
			uploaded:'',		//uploadedID
			input:'',			//clsInput
		},
		setting:{
			container:'',				//containerID , unique id for image uploader
			title:'Image selector',
			count:0,
			max:9,
			style:'inner',
		},

		uploaderID:'uploaderInput',			//上传file的id
		clsThumb:'weui-uploader__file',	//缩略图的选择class
		
		addID:'img_add',							//图像添加按钮的id
		removeID:'file_remove',				//图像删除按钮的id
		imagePre:'img_',							//图像缩略图列表的id前缀
		sumID:'img_sum',							//图像总量显示容器的id
		idsID:'img_ids',								//保存图像id的容器
		maxID:'img_max',							//图像最大上传数量容器的id
		uploadedID:'uploaderFiles',			//已经上传的图像容器
		getImagesFun:null,
		exif:{					//exif信息读取的偏移
			
		},
		title:'',				//图像上传
		mkey:'',				//外部传入的key值，用于传出数据
		clsInput:'',			//外部附加的value储存的class，方便外部获取数据
		count:0,				//计数器，上传了多少图像
		max:9,					//最大上传图像数
	};

	//cache images result (base64)
	var cache={

	};

	var agent={
		getImagesFun:null,
	};

	//调用的
	var events={
		thumb:null,
		remove:null,
		add:null,
	};
	
	var self={
		//需改配置，把外部导入的配置写入
		init:function(cfg,agent){
			//1. init basic setting;
			for(var k in me.setting)if(cfg[k]) me.setting[k]=cfg[k];
			for(var k in events)if(agent[k]) events[k]=agent[k];
			self.structClass();

			//2.struct upload dom and bind function
			var con=me.setting.container;
			self.entry(con,[]);
		},
		structClass:function(){
			var hash=self.hash;
			var pre=me.prefix;
			for(var k in me.cls){
				me.cls[k]=hash(pre);
			};
			return true;
		},
		hash:function(pre){ return pre+Math.random().toString(36).substr(6)},
		/*手机上传部分功能实现*/
		entry:function(con,ids){
			//1.生成dom并加载
			self.domUpload(con,ids);
			//2.处理基础信息的显示
			self.setMax(me.max);
			self.setSum(me.count);
			
			//3.不同的绑定操作
			if(ids.length==0){
				self.showCount();			//显示计数器数据
				self.upload();					//绑定上传操作
			}else{
				me.count=ids.length;
				showCount();			//显示计数器数据
				if(events.thumb!=null){
					events.thumb(ids,function(imgs){		//3.3获取图像的缩略图
						for(var id in imgs){
							self.thumb(id,imgs[id].middle);
						}
						self.remove();					//绑定删除操作
						self.upload();					//绑定上传操作
					});
				}
			}
		},
		setMax:function(n){
			$("#"+me.maxID).html(n);		//3.1设置显示最大图像上传数
		},
		setSum:function(n){
			$("#"+me.sumID).html(n);
		},
		domUpload:function(con,ids){
			//1.处理已经有的图像
			var dom='<div class="weui-cell" id="'+me.containerID+'"><div class="weui-cell__bd"><div class="weui-uploader">';
			dom+='<div class="weui-uploader__hd"><p class="weui-uploader__title">'+me.title+'</p>';
			dom+='<div class="weui-uploader__info"><span id="'+me.sumID+'">0</span>/<span id="'+me.maxID+'">'+me.max+'</span></div>'
			dom+='</div>';
			dom+='<div class="weui-uploader__bd">';
			
			//2.生成image的列表结构
			dom+='<ul class="weui-uploader__files" id="'+me.uploadedID+'">';
			if(ids.length!=0){
				for(var i=0,ilen=ids.length;i<ilen;i++)dom+=self.row(ids[i]);
			}
			dom+='</ul>';
			
			if(ilen==0 || ilen<me.max) dom+=self.domAdd();		//2.1显示添加的数据结构
			
			var val=ilen==0?'':self.encode(ids);
			dom+='<input id="'+me.idsID+'" class="'+me.clsInput+'" value="'+val+'" type="hidden">';		//保存值的input
			dom+='</div>';	
			dom+='</div></div></div>';
			$(con).html(dom);
		},
		domFile:function(){
			return '<div class="weui-uploader__input-box" id="'+me.addID+'" style="margin-top:-10px"><input id="'+me.uploaderID+'" class="weui-uploader__input" type="file" accept="image/*" multiple/></div>';
		},
		row:function(id,src){
			var cls=me.cls;
			if(src==undefined) return '<li class="'+cls.thumb+'" id="'+me.imagePre+id+'" style="text-align:center;line-height:96px;"></li>';
			return '<li class="'+cls.thumb+'" id="'+me.imagePre+id+'" style="text-align:center;line-height:96px;background-image:url('+src+')"></li>';
		},
		thumb:function (id,src){
			$("#"+me.imagePre+id).css({'background-image':'url('+src+')'});
		},
		remove:function(){
			var cls=me.cls;
			$("#"+me.containerID).find('.'+cls.thumb).off('click').on('click',function(){
				var dom='<span id="'+me.removeID+'" style="background:#FFFFFF;color:#FFBE00;padding:5px 10px 5px 10px;border-radius:5px;">删除</span>';
				$(this).html(dom).addClass('active').siblings().removeClass('active').html('');
					
				$("#"+me.removeID).off('click').on('click',function(){
					var iid=parseInt($(this).parent().prop('id').split('_').pop());
					self.removeIDs(iid);							//移除数据
					$(this).parent().remove();					//移除dom
					me.count--;										//处理计数器
					self.checkAdd();								//处理是否要显示add部分
					self.showCount();								//显示计数器数据
					self.remove();									//重新绑定删除操作
					if(agent.remove) agent.remove(iid,mkey);		//回调添加图像后的操作
				});
			});
		},
		checkAdd:function(){
			if(me.count==me.max){
				$("#"+me.addID).remove();
			}else if(count<max){
				if($("#"+me.addID).length==0){
					var dom=self.domFile();
					$("#"+me.uploadedID).after(dom);			//补添加的图标
					upload();												//重新绑定上传操作
				}
			}
		},
		showCount:function (){
			self.setSum(me.count);
			$("#"+me.addID).css({'margin-top':me.count>2?'0px':'-10px'});			//修正添加框的位置
		},
		removeIDs:function(id){
			var ids=$("#"+me.idsID).val();
			if(!ids) return false;
			var arr=[],tmp=ids.split('-');
			for(var i=0,len=tmp.length;i<len;i++){
				if(parseInt(tmp[i])!=id) arr.push(tmp[i]);
			}
			$("#"+me.idsID).val(self.encode(arr));
		},
		saveIDs:function(id){
			var ids=$("#"+me.idsID).val();
			if(!ids){
				var str=self.encode([id]);
			}else{
				var tmp=ids.split('-');
				tmp.unshift(id);
				var str=self.encode(tmp);
			}
			$("#"+me.idsID).val(str);
		},
		/*通用方法部分*/
		upload:function (){
			/*var cfg={
				uploadURL:'api.php?mod=attachment&act=upload&spam='+Q.getRun('spam'),
			}*/
			$("#uploaderInput").on('change',function(){
				var len=this.files.length;
				if(len+count>max) return Q.showToast('最大只能上传'+max+'张');
					
				count+=len;				//计数器修改
				showCount();			//显示计数器
					
				for(var k=0;k<len;k++){
					var txt='<li class="weui-uploader__file" style="background-image:url(view/v1/static/loading.gif)" id="before_upload_'+k+'"></li>';
					$("#"+me.uploadedID).prepend(txt);			//前端增加显示部分
								
					compress(this.files[k],k,function(rs,ro,index){
						var formData = new FormData();
						formData.append("photo", rs);
						formData.append("ikey",index);							//把文件信息放到post里
						if(ro>0) formData.append("rotation",ro);			//放旋转信息进去
						$.ajax({
							url: me.uploadURL,type:'post',async:true,processData:false,contentType:false,data:formData,timeout:6000,
							success:function (res) {
								var res=JSON.parse(res);
								if(!res.success) return false;
									
								$("#before_upload_"+res.ikey).remove();						//删除临时的缩略图显示
								$("#"+me.uploadedID).prepend(row(res.id,res.thumb.src.small));		//前端增加显示部分
								remove();															//重新绑定图像删除操作
								if(agent.add) agent.add(res.id,mkey);					//回调添加图像后的操作
								saveIDs(res.id);									//保存好图像ID
									
							},
							error:function (xhr,res) {
								//console.log(res);
							}
						});
					});			
				}
				checkAdd();				//重新绑定添加按钮
			});
		},
		compress:function(fa,index,ck){
			var ro=0;
			if(fa.size < Math.pow(1024, 2) || fa.type!='image/jpeg') return ck && ck(fa,ro,index);		//小文件和非jpg文件不压缩
			var name=fa.name,reader= new FileReader();
			reader.readAsDataURL(fa);
			reader.onload=function(e){
				var img=new Image();
				img.src=e.target.result;
				img.onload=function(ee){
						//处理图像的旋转
					if(ee.path[0] && ee.path[0].src){
						var b64=ee.path[0].src;
			           	var ro=getOrientation(base64ToArrayBuffer(b64));
					}
					var zwidth=1500;			//需要压缩到的图像尺寸
					var ratio=zwidth/img.width,w=img.width*ratio,h=img.height*ratio,q=0.8;
					var cvs=document.createElement('canvas'),ctx=cvs.getContext('2d');
					var anw= document.createAttribute("width"),anh=document.createAttribute("height");
					anw.nodeValue=w;
					anh.nodeValue=h;
					cvs.setAttributeNode(anw);
		            cvs.setAttributeNode(anh);
			            
					ctx.fillStyle = "#fff";
		            ctx.fillRect(0, 0, w, h);
					ctx.drawImage(img, 0, 0, w, h);
			            
		            var base64 = cvs.toDataURL('image/jpeg', q),bytes = window.atob(base64.split(',')[1]);  // 去掉url的头，并转换为byte
					var ab = new ArrayBuffer(bytes.length),ia = new Uint8Array(ab);
					for (var i = 0; i < bytes.length; i++)ia[i] = bytes.charCodeAt(i);
			            
					fb = new Blob([ab], {type:'image/jpeg'});
					fb.name = name;
					ck && ck(fb,ro,index);
				}
			}
		},
		base64ToArrayBuffer:function(base64) {
			base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
			var binary = atob(base64);
			var len = binary.length;
			var buffer = new ArrayBuffer(len);
			var view = new Uint8Array(buffer);
			for (var i = 0; i < len; i++) {
				view[i] = binary.charCodeAt(i);
			}
			return buffer;
		},
		getStringFromCharCode:function(dataView, start, length) {
			var str = '';
			var i;
			for (i = start, length += start; i < length; i++) {
				str += String.fromCharCode(dataView.getUint8(i));
			}
			return str;
		},
		getExif:function(buffer,keys){
			
		},
		getOrientation:function(arrayBuffer){
			var dataView = new DataView(arrayBuffer);
			var length = dataView.byteLength;
			var orientation,exifIDCode,tiffOffset,firstIFDOffset,littleEndian,endianness,appStart,ifdStart,offset,i;
			if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
				offset = 2;
				while (offset < length){
					if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
						appStart = offset;
						break;
					}
					offset++;
				}
			}
				
			if (appStart) {
				exifIDCode = appStart + 4;
				tiffOffset = appStart + 10;
				if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
					endianness = dataView.getUint16(tiffOffset);
					littleEndian = endianness === 0x4949;
					if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
						if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
							firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);
							if (firstIFDOffset >= 0x00000008) {
								ifdStart = tiffOffset + firstIFDOffset;
							}
						}
					}
				}
			}
				
			if (ifdStart){
				length = dataView.getUint16(ifdStart, littleEndian);
				for (i = 0; i < length; i++) {
					offset = ifdStart + i * 12 + 2;
					//0x0112是旋转对应的位置
					if (dataView.getUint16(offset, littleEndian) === 0x0112) {
						offset += 8;
						orientation = dataView.getUint16(offset, littleEndian);
						// Override the orientation with its default value for Safari (#120)
						/*if (IS_SAFARI_OR_UIWEBVIEW) {
							dataView.setUint16(offset, 1, littleEndian);
						}*/
						break;
					}
				}
			}
			return orientation;
		},
		encode:function(arr,c){
			var c=c||'-',s='';
			for(var i=0,len=arr.length;i<len;i++)s+=arr[i]+(i==len-1?'':c);
			return s;
		},
	};

	window[me.appName]=self;
})();