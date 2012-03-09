define([
'views/dialogs/dialog',
//'jquery/slDropFile',
'jquery/fileuploader',
//'jquery/sendFile',
'jquery/jquery.jcrop'
],function(){
	App.views.dialogs.ImageSelectorView = App.views.Dialog.extend({
		el: '#content',
		initialize:function(){
			_.bindAll(this,'handleClick', 'imgUploaded', 'imgUploadProgress', 'imgBeforeSend', 'triggerUpload', 'goEdit', 'updateThumb', 'saveThumb','changedRevision','updatePreview', 'jcropOnSelect');
			var thisClass = this;
			this.init(this.options);
			this.template ='imageSelector';
			//this.router = this.options.router;
			if (this.options.view) this.view = this.options.view;
			else this.view = 'gallery';
			this.parentWindow = this.options.windowId;
			this.width = 974;
			this.collection = App.collections.images;
			this.classes ="black";
			this.maskClass = "white";
			this.jcropapi;
			this.height = 562;
			this.closable = true;
			this.uploadField = "#uploader-field-"+this.cid;
			this.currentPreview = false;
			this.currentModel = false;
			this.rotation = 0;
			this.previewMaxSize = 500;
			this.collection.on('change',this.changedRevision);
			this.destroyOnClose = false;
			if (BrowserDetect.dragAndDrop())  this.dragable = true;
			else this.dragable = false;

			var data = {images:this.collection.toJSON(), view:this.view, cid: this.cid, dragable:this.dragable};
			var thisClass = this;
			
			if (this.options.selected) data.selected = this.options.selected;
			this.createDialog(data,function(){
				//$('#uploader-'+thisClass.cid).uploader({targetPath:ROOT_URL + "ajax/upload.php", allow:false, uploadField: thisClass.uploadField, imgUploaded:thisClass.imgUploaded,onProgress:thisClass.imgUploadProgress,beforesend:thisClass.beforeSend, afterUpload:thisClass.afterUpload});
				var dropable = $('#uploader-'+thisClass.cid)[0];
				if (thisClass.dragable) var dragDrop = dropable;
				thisClass.uploader = new qq.FileUploaderBasic({
					element: dropable,
					button: dropable,
					dragDrop: dragDrop,
					action: ROOT_URL+'ajax/upload.php',
					//debug: true,
					onSubmit: thisClass.imgBeforeSend,
					onProgress: thisClass.imgUploadProgress,
					onComplete: thisClass.imgUploaded,
					allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
					sizeLimit: 8*1024*1024,
				});
			});
		},
		events: function() {
			var _events = {};
			var windowId = "#dialog-"+this.cid;
			//_events['dblclick '+windowId+' .img-item'] = 'handleClick';
			_events['click '+windowId+' .img-item'] = 'handleClick';
			_events['click '+windowId+' .btn_edit'] = 'goEdit';

			_events['click '+windowId+' #btn_rotate_left'] = 'doRotation';
			_events['click '+windowId+' #btn_rotate_right'] = 'doRotation';
			_events['click '+windowId+' #btn_edit_cancel'] = 'goGallery';
			_events['click '+windowId+' #btn_edit_save'] = 'saveThumb';
			_events['click '+windowId+' #btn_select_img'] = 'handleClick';
			_events['click '+windowId+ '#uploader-field-'+this.cid] = 'doUpload';
			_events['click '+windowId+' #uploader-'+this.cid] = 'triggerUpload';
		
			return _events;
		},
		changedRevision:function(model,revision){
			if (model.hasChanged('rev')) {
				//log("changed revision", model, revision, this.currentModel);
				var id = model.get('id');
				var thumb = model.getUrl('thumbnail');
				$('#img_'+id).find('img').attr('src',thumb);
				
				/*if(this.view == 'edit' && model.hasChanged('r')){
					if(!this.currentModel || model.get('id') != this.currentModel.get('id')) return;
					this.updatePreview(revision);
				}*/
			}
		},
		updatePreview:function(){
			var thisModel = this.currentModel;
			var thisClass = this;
			$('.contentpane').addClass('loading');
			//$('#preview_wrapper').fadeOut(function() {
				var wrapper = $('#preview_wrapper');
				var left = Math.round(($('.contentpane').width()-thisModel.get('w'))/2);
				var top = Math.round(($('.contentpane').height()-thisModel.get('h'))/2);
				top = top<0 ? 0 : top;
				//log("position", left, top, $('.contentpane').width(), $('.contentpane').height(), thisModel.get('w'), thisModel.get('h'));
				
				
				$('<img />').attr('src',thisModel.getUrl('preview')).load(function() {
					var imgEl = $(this);
					//Set thumb
					var thumb = imgEl.clone().attr('id', 'image_thumbnail');
					$('#thumbnail_wrapper').html(thumb);
					thisClass.updateThumb();
					//Set preview img
					var preview = imgEl.attr('id', 'image_preview');
					wrapper.queue('fx', function() {
						wrapper.css({position:'absolute',left: left, top: top});
						wrapper.find('img, .jcrop-holder').remove();
						wrapper.append(preview);
						$('.contentpane').removeClass('loading');
						$(this).dequeue();
					});
					wrapper.fadeIn(function() {
						if (!thisClass.jcropapi) thisClass.setJcrop();
					});
				})
			//});
		},
		setJcrop:function(){
			if (!this.currentModel) return;
			if(this.jcropapi) this.jcropapi.destroy();
			var thisClass = this;
			var thumb = this.currentModel.get('t');
			
			$('#image_preview').Jcrop({
				onChange: thisClass.updateThumb,
				onSelect: thisClass.jcropOnSelect,
				aspectRatio: 1,
				sideHandles: false,
				setSelect: [ thumb.x, thumb.y, (thumb.x+thumb.w), (thumb.y+thumb.h) ],
				minSize: [150, 150]
			}, function() {
				thisClass.jcropapi = this;
			});
			
		},
		imgUploaded:function(id, filename, response){
			//log("imgUploaded", id, filename, response);
			if (!response) {
				log("Image is too big");
				this.afterUpload();
			}
			var model = new App.models.Image(response.data);
			this.collection.add(model);
			var imgId = model.get('id');
			
			var img = $('<img />').attr('src', model.getUrl('thumbnail')).load(function() {
				var button = $('<button class="button blue btn_edit" id="btn_edit_'+imgId+'">Tilpas</button>');
				$('#temp_img_'+id).removeClass('loading').html($(this)).append(button).attr('id', "img_"+imgId);

			});
		},
		imgUploadProgress:function(id, filename, uploaded, total) {
			//log("imgUploadProgress", id, filename, uploaded, total);
			var width = uploaded/total * 100;
			$('#temp_img_'+id).find('.progressbar span').width(width+'%');
		},
		imgBeforeSend:function(id, filename){
			//log("beforeSend", id, filename);

			$('#uploader-'+this.cid).after('<div class="img-item loading" id="temp_img_'+id+'"><div class="progressbar"><span></span></div></div>');
		},
		imgShowError:function(message){
			log("error", message);
		},
		doUpload:function(event, doIt) {
			if (!doIt) return false;
		},
		triggerUpload: function() {
			$("#dialog-"+this.cid+' #uploader-field-'+this.cid).trigger('click',true);
		},
		handleClick:function(event) {
			if (this.view = 'edit' && this.currentModel) {
				if (this.thumbEdited) {
					var thisClass = this;
					$('#btn_select_img').html('&nbsp').addClass('loading');
					this.saveThumb(function() {
						$('#btn_select_img').removeClass('loading');
						thisClass.selectImg(thisClass.currentModel.get('id'));
					});
				} else this.selectImg(this.currentModel.get('id'));
			} else {
				var id = event.currentTarget.id;
				var imgId = id.substr(4);
				var img = this.collection.get(imgId);
				if (img) this.selectImg(img.get('id'));
			}
		},
		selectImg:function(id) {
			$(this.dialogId+' .selected').removeClass('selected');
			$(this.dialogId+' #img_'+id).addClass('selected');
			this.router.trigger('imageSelected', {imgId: id, windowId:this.parentWindow});
			if (this.view = 'edit') this.goGallery();
			this.closeDialog();
		},
		doRotation:function(event){
			if (this.jcropapi) {
				this.jcropapi.destroy();
				this.jcropapi = null;
			}
			if(!event || !event.currentTarget || !event.currentTarget.id) return;
			var thisClass = this;
			var id = event.currentTarget.id;
			if(id == 'btn_rotate_left') var rotation = -90;
			else if(id == 'btn_rotate_right') var rotation = 90;
			
			if(rotation){
				$('.contentpane').addClass('loading');
				$('#preview_wrapper').fadeOut();
				rotation = this.currentModel.get('r') + rotation;
				this.currentModel.save({r:rotation}, {success: function(d, data) {
					//log("success", data, d);
					if (data.success=='true') {
						thisClass.updatePreview();
					} else log("error", data, d);
				}, error: function(d, data) {
					log("error", data, d);
				}});
			}
		},
		jcropOnSelect:function(coords) {
			if (!this.thumbEdited) {
				$('#btn_edit_save').fadeIn();
				$('#btn_select_img').html('Gem og vælg');
				this.thumbEdited = true;
			}
			this.updateThumb(coords);
		},
		updateThumb: function(coords)
		{
			if (this.currentModel) {
				if (!coords) coords = this.currentModel.get("t");
				if (this.thumbEdited) {
					var btn = $('#btn_edit_save');
					var top = coords.y2 - btn.outerHeight() -10;
					var left = coords.x2 - btn.outerWidth() -10;
					$('#btn_edit_save').css({top:top, left:left});
				}
				var thisClass=this;
				// 150 is the size of the thumbnail
				var rx = 150 / coords.w;
				var ry = 150 / coords.h;
				var dX = 0;
				var dY = 0;
				
				$('#image_thumbnail').css({
					width: Math.round(rx * thisClass.currentModel.get("w")) + 'px',
					height: Math.round(ry * thisClass.currentModel.get("h")) + 'px',
					marginLeft: (-1*Math.round(rx * coords.x) + dX) + 'px',
					marginTop:  (-1*Math.round(ry * coords.y) + dY) + 'px'
				});
			}
		},
		saveThumb: function(onSave) {
			if (!this.currentModel||!this.thumbEdited) return;
			$('#btn_edit_save').html('&nbsp').addClass('loading');
			var thisClass = this;
			var obj = {};
			if (this.jcropapi) {
				var t = this.jcropapi.tellSelect();
				obj.x = t.x;
				obj.y = t.y;
				obj.w = t.w;
				obj.h = t.h;
			}
			if (!_.isEqual(obj,this.currentModel.get('t'))) {
				this.currentModel.save({t:obj}, {success: function(d, data) {
					if (data.success=='true') {
						$('#btn_edit_save').fadeOut(function() { $(this).removeClass('loading').html('Gem') });
						$('#btn_select_img').html('Vælg billede');
						log(onSave);
						if (onSave&&$.isFunction(onSave)) onSave();
						thisClass.thumbEdited = false;
						
					} else log("error", data, d);
				}, error: function(d, data) {
					log("error", data, d);
				}});
			} else {
				$('#btn_edit_save').fadeOut(function() { $(this).removeClass('loading').html('Gem') });
				$('#btn_select_img').html('Vælg billede');
				if (onSave&&$.isFunction(onSave)) onSave();
				this.thumbEdited = false;
			}
		},
		goEdit: function(obj) {
			obj.stopPropagation();
			var thisClass = this;
			var id = obj.currentTarget.id;
			var imgId = id.substr(9);
			thisClass.currentModel = this.collection.get(imgId);
			//log("goEdit - currentModel",thisClass.currentModel.toJSON());
			
			this.updatePreview();
			this.changeView('edit');
		},
		goGallery: function() {
			if (this.jcropapi) {
				this.jcropapi.destroy();
				this.jcropapi = null;
			}
			
			this.currentModel = false;
			this.changeView('gallery', function() {
				$('#image_preview, #image_thumbnail').remove();	
			});
		},
		changeView: function(goto, callback) {
			if (goto=='edit' && this.view=='gallery') {
				$('#gallery-view').hide("slide", {direction:"left", easing: "easeOutQuint"}, 500);
				$('#edit-view').show("slide", {direction:"right", easing: "easeOutQuint"}, 500);
				this.view = 'edit';
			} else if (goto=='gallery' && this.view=='edit') {
				$('#edit-view').hide("slide", {direction:"right", easing: "easeOutQuint"}, 500);
				$('#gallery-view').show("slide", {direction:"left", easing: "easeOutQuint"}, 500);
				this.view = 'gallery';
			}
			
			/*
			if (goto=='edit' && this.view=='gallery') {
				$('#gallery-view').fadeOut();
				$('#edit-view').fadeIn(400, callback);
				this.view = 'edit';
			} else if (goto=='gallery' && this.view=='edit') {
				$('#edit-view').fadeOut();
				$('#gallery-view').fadeIn(400, callback);
				this.view = 'gallery';
			}
			*/
		}
	});
});