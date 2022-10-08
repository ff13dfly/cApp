;(function(){
	var me={
		appName:'cUpload',
		prefix:'a_',			//class prefix
		cls:{
			title:'',			//title class
			file:'',			//file input id
			thumb:'', 			//clsThumb
			add:'',				//add image
			remove:'',			//remove image function class
			pre:'',				//image pre
			sum:'',				//sum account id
			max:'',				//max amount id
			ids:'',				//more ids 
			uploaded:'uploaderFiles',		//uploaded container id 
			input:'',			//clsInput
		},
		setting:{
			container:'',				//containerID , unique id for image uploader
			title:'Image selector',		//uploader title
			count:0,					//uploaded count
			max:9,						//max upload amount
			style:'inner',				//['inner','extend'] container style
			exif:{},				//exif offset params
			mkey:'',				//unkown key
		},
	};

	var cache={

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
			self.entry("#"+con,[]);
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

		entry:function(con,ids){
			//1.basic dom struct;
			$(con).html(self.getCSS()+self.getDom());
			self.amountUpdate();
			self.bind();

			self.appendRow();
			self.appendRow();
			self.appendRow();
			self.appendRow();
		},
		getDom:function(){
			var cls=me.cls;
			return `<div class="row">
				<div class="col-12 ${cls.title}">${me.setting.title}</div>
				<div class="col-4">
					<input style="display:none"  class="${cls.file}" type="file" accept="image/*" multiple/>
					<p class="${cls.add}">
						<span>+</span>
					</p>
				</div>
				<div class="col-12">
					<span class="${cls.sum}">0</span>/<span class="${cls.max}">0</span>
				</div>
			</div>`;
		},
		getCSS:function(){
			var cls=me.cls,con=me.setting.container;
			return `<style>
				#${con} .${cls.thumb}{height:100px;line-height:100px;background:#EEEEEE;text-align:center;margin-top:8px;}
				#${con} .${cls.add}{height:100px;line-height:100px;background:#EEEEEE;text-align:center;margin-top:8px;}
				#${con} .${cls.add} span{width:100%;height:100px;font-size:100px;margin:0 auto;opacity:1;color:#BBBBBB;margin-top:-16px;}
				#${con} .${cls.thumb}.active{background:#CCCCCC;}
				#${con} .${cls.remove}{background:#FFFFFF;color:#FFBE00;padding:5px 10px 5px 10px;border-radius:5px;}
			</style>`;
		},
		appendRow:function(fa){
			var cls=me.cls,con=me.setting.container;
			var bg=!fa?"":fa;
			var dom=`<div class="col-4" >
				<p class="${cls.thumb}" style="background-image:url(${bg})"></p>
			</div>`;
			$('#'+con).find('.'+cls.add).parent().before(dom);

			me.setting.count++;
			self.amountUpdate();
			self.bind();
			return true;
		},
		amountUpdate:function(){
			self.setMax(me.setting.max);
			self.setSum(me.setting.count);
		},
		bind:function(){
			var cls=me.cls,con=me.setting.container;
			//1.upload function bind
			$("#"+con).find('.'+cls.file).off('change').on('change',function(){
				var len=this.files.length;
				if(len+me.setting.count > me.setting.max) return Q.showToast('Max upload'+me.setting.max);
				for(var k=0;k<len;k++){
					self.compress(this.files[k],k,function(rs,rotate,index){
						self.appendRow(rs);
					});		
				}
			});

			$("#"+con).find('.'+cls.add).off('click').on('click',function(){
				$("#"+con).find('.'+cls.file).trigger("click");
			});

			//2.thumb function bind
			$("#"+con).find('.'+cls.thumb).off('click').on('click',function(){
				$("#"+con).find('.'+cls.thumb).removeClass('active').html('');

				var btn=`<span class="${cls.remove}">删除</span>`;
				$(this).html(btn).addClass('active');
				self.bind();
			});

			//3.remove function bind
			$("#"+con).find('.'+cls.remove).off('click').on('click',function(){
				console.log('ready to remove');

				$(this).parent().parent().remove();
				me.setting.count--;
				self.amountUpdate();
				self.bind();
			});
		},
		toast:function(txt){

		},
		setMax:function(n){
			$("#"+me.setting.container).find('.'+me.cls.max).html(n);
			//$("#"+me.cls.max).html(n);		//3.1设置显示最大图像上传数
		},
		setSum:function(n){
			$("#"+me.setting.container).find('.'+me.cls.sum).html(n);
			//$("#"+me.cls.sum).html(n);
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
			           	var ro=self.getOrientation(self.base64ToArrayBuffer(b64));
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
			            
					fb = new Blob([ab],{type:'image/jpeg'});
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
				if (self.getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
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