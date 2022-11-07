; (function (App) {
	var me={
		//appName:'cUpload',
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
			max:3,						//max upload amount
			width:1500,					//image compress width
			quality:0.7,				//image compress quality
		},
	};

	var cache=[];		//image list cache

	var events={
		thumb:null,
		change:null,
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
		},
		getResult:function(){
			return cache;
		},
		getDom:function(){
			var cls=me.cls;
			return `<div class="row">
				<div class="col-6 ${cls.title}">${me.setting.title}</div>
				<div class="col-6 text-end">
					<span class="${cls.sum}">0</span>/<span class="${cls.max}">0</span>
				</div>
				<div class="col-4">
					<input style="display:none"  class="${cls.file}" type="file" accept="image/*" multiple/>
					<p class="${cls.add}">
						<span>+</span>
					</p>
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
		appendRow:function(bs64,index,skip){
			var cls=me.cls,con=me.setting.container;
			var dom=`<div class="col-4" index="${index}">
				<p class="${cls.thumb}" style="background-image:url(${bs64});background-size: cover;"></p>
			</div>`;
			$('#'+con).find('.'+cls.add).parent().before(dom);

			if(!skip) me.setting.count++;
			self.amountUpdate();
			self.bind();

			if(events.change) events.change(cache);
			return true;
		},
		clearRow:function(){
			var cls=me.cls,con=me.setting.container;
			$("#"+con).find('.'+cls.thumb).parent().remove();
		},
		domCache:function(){
			for(var i=0;i<cache.length;i++){
				self.appendRow(cache[i],i,true);
			}
			return true;
		},
		amountUpdate:function(){
			self.setMax(me.setting.max);
			self.setSum(me.setting.count);
		},
		bind:function(){
			var cls=me.cls,con=me.setting.container;
			var start=me.setting.count;
			//1.upload function bind
			$("#"+con).find('.'+cls.file).off('change').on('change',function(){
				var len=this.files.length;
				var sum=len+me.setting.count;
				if(sum > me.setting.max) return self.toast('Max upload'+me.setting.max);
				if(sum === me.setting.max) self.hideAdd();
				for(var k=0;k<len;k++){
					cache.push(null);
					self.load(this.files[k],k,function(bs64,order){
						var index=start+order;
						cache[index]=bs64;
						self.appendRow(bs64,index);
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
				//console.log('ready to remove');
				var sel=$(this).parent().parent();
				var index=parseInt(sel.attr("index"));
				sel.remove();
				me.setting.count--;
				self.amountUpdate();

				if(me.setting.count<me.setting.max) self.showAdd();

				if(!self.removeCache(index)) return false;
				if(events.change) events.change(cache);
				self.clearRow();
				self.domCache();
				self.bind();
			});
		},
		removeCache:function(index){
			if(index>=cache.length-1) return false;
			var arr=[];
			for(var i=0;i<cache.length;i++){
				if(i!=index) arr.push(cache[i]);
			}
			cache=arr;
			return true;
		},
		toast:function(txt){
			var cls=me.cls,con=me.setting.container;
			$("#"+con).find('.'+cls.title).html(`<span class="text-waring">${txt}</div>`);
			setTimeout(function(){
				$("#"+con).find('.'+cls.title).html(me.setting.title);
			},1500);
		},
		setMax:function(n){
			$("#"+me.setting.container).find('.'+me.cls.max).html(n);
		},
		setSum:function(n){
			$("#"+me.setting.container).find('.'+me.cls.sum).html(n);
		},
		hideAdd:function(){
			$("#"+me.setting.container).find('.'+me.cls.add).parent().hide();
		},
		showAdd:function(){
			$("#"+me.setting.container).find('.'+me.cls.add).parent().show();
		},
		load:function(fa,index,ck){
			var arr=fa.name.split('.');
			if(arr[arr.length-1].toLowerCase()=='heic'){
				if(!heic2any) return ck && ck(fa,index);	//抛出错误
				heic2any({blob:fa,toType:'image/jpeg'}).then(function(bb){
					var uu=URL.createObjectURL(bb);
					self.compress(uu,function(dt){
						ck && ck(dt,index);
					});
				});
			}
			
			var reader= new FileReader();
			reader.readAsDataURL(fa);
			reader.onload=function(e){
				var bs64=e.target.result;
				if(fa.size < Math.pow(1024, 2) || fa.type!='image/jpeg'){
					return ck && ck(bs64,index);
				}

				self.compress(bs64,function(dt){
					ck && ck(dt,index);
				});
			};
		},
		compress:function(url,ck){
			var img=new Image();
			img.src=url;
			img.onload=function(){
				var ratio=me.setting.width/img.width,w=img.width*ratio,h=img.height*ratio;
				var cvs=document.createElement('canvas'),ctx=cvs.getContext('2d');
				var anw= document.createAttribute("width"),anh=document.createAttribute("height");
				anw.nodeValue=w;
				anh.nodeValue=h;
				cvs.setAttributeNode(anw);
				cvs.setAttributeNode(anh);
						
				ctx.fillStyle = "#fff";
				ctx.fillRect(0, 0, w, h);
				ctx.drawImage(img, 0, 0, w, h);
				
				var type='image/jpeg';
				var base64 = cvs.toDataURL(type, me.setting.quality),bytes = window.atob(base64.split(',')[1]);  // 去掉url的头，并转换为byte
				var ab = new ArrayBuffer(bytes.length),ia = new Uint8Array(ab);
				for (var i = 0; i < bytes.length; i++)ia[i] = bytes.charCodeAt(i);
				var fb = new Blob([ab], {type:type});

				var reader = new FileReader();
				reader.readAsDataURL(fb);
				reader.onloadend = function() {
					var bs64 = reader.result;
					ck&& ck(bs64);
				};
			};
		},
	};
	//window[me.appName]=self;
	App.cache.setG("uploader",self);
})(cMedia);