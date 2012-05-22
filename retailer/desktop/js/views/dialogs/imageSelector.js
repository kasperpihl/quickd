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
			_.bindAll(this,'handleClick', 'imgUploaded', 'setJcrop', 'triggerUpload', 'goEdit', 'updateThumb', 'saveThumb', 'changedRevision','updatePreview', 'jcropOnSelect', 'imgDelete', 'deleteConfirmCallback');
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
      this.level = 0;
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
			log(REAL_URL+'api/shopowner/upload/template_img');
			if (this.options.selected) data.selected = this.options.selected;
			this.createDialog(data,function(){
				//$('#uploader-'+thisClass.cid).uploader({targetPath:ROOT_URL + "ajax/upload.php", allow:false, uploadField: thisClass.uploadField, imgUploaded:thisClass.imgUploaded,onProgress:thisClass.imgUploadProgress,beforesend:thisClass.beforeSend, afterUpload:thisClass.afterUpload});
				var dropable = $('#uploader-'+thisClass.cid)[0];
				var dragDrop = thisClass.dragable?dropable:null;
				thisClass.uploader = new qq.FileUploader({
					element: dropable,
					button: dropable,
					dragDrop: dragDrop,
					template: null,
					listElement: $('#gallery-view')[0],
					useList: false,
					action: REAL_URL+'api/shopowner/upload/template_img',
					//debug: true,
					onComplete: thisClass.imgUploaded,
					onCancel: thisClass.imgUploadCancelled,
					allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
					sizeLimit: 8*1024*1024,
					fileTemplate: '<div class="img-item loading">'+
                '<span class="upload-spinner"></span>' +
						 		'<span class="upload-filename"></span>' +
                '<span class="upload-size"></span>' +
								'<div class="progressbar"><span></span></div>'+
								'<div class="remove_icon upload-cancel"/>'+
							'</div>',
					classes: {
            // used to get elements from templates
            button: 'dropable',
            drop: 'dropable',
            dropActive: 'dragover',
            list: 'qq-uploader-list',
                        
            file: 'upload-filename',
            spinner: 'upload-spinner',
            size: 'upload-size',
            progressbar: 'progressbar',
            cancel: 'upload-cancel',

            // added to list item when upload completes
            // used in css to hide progress spinner
            success: 'qq-upload-success',
            fail: 'qq-upload-fail'
        	}
				});
			});
      
		},
		events: function() {
			var _events = {};
			var windowId = "#dialog-"+this.cid;
			//_events['dblclick '+windowId+' .img-item'] = 'handleClick';
			_events['click '+windowId+' .img-item'] = 'handleClick';
			_events['click '+windowId+' .btn_edit'] = 'goEdit';
			_events['click '+windowId+' .btn_delete'] = 'imgDelete';

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
			log('changedRevision')
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
				//var top = Math.round(($('.contentpane').height()-thisModel.get('h'))/2);
				//top = top<0 ? 0 : top;
				var top = 0;
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
			log("imgUploaded", id, filename, response);
			if (!response) {
				log("Image is too big");
				this.router.showError('Fejl ved upload', 'Billede var for stort og blev ikke uploadet')
			} else {
				var model = new App.models.Image(response.data);
				this.collection.add(model);
				var imgId = model.get('id');

				var img = $('<img />').attr('src', model.getUrl('thumbnail')).load(function() {
					$('#temp_img_'+id).removeClass('loading').html($(this))
						.append('<button class="blue btn_edit" id="btn_edit_'+imgId+'">Tilpas</button>')
						.append('<div class="remove_icon btn_delete" id="btn_delete_'+imgId+'"></div>')
						.attr('id', "img_"+imgId);
				});
			}
		},
		imgShowError:function(message){
			log("error", message);
		},
		imgUploadCancelled:function(id, filename) {
			log("cancelled", id, filename);
		},
		doUpload:function(event, doIt) {
			if (!doIt) return false;
		},
		triggerUpload: function() {
			$("#dialog-"+this.cid+' #uploader-field-'+this.cid).trigger('click',true);
		},
		handleClick:function(event) {
      if (this.view == 'edit' && this.currentModel) {
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
			if (this.view == 'edit') this.goGallery();
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
				$('#btn_select_img').html('Gem og brug');
				this.thumbEdited = true;
			}
			this.updateThumb(coords);
		},
		updateThumb: function(coords)
		{
			//log('updateThum',coords);
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
						$('#btn_select_img').html('Brug billede');
						if (onSave&&$.isFunction(onSave)) onSave();
						thisClass.thumbEdited = false;
						
					} else log("error", data, d);
				}, error: function(d, data) {
					log("error", data, d);
				}});
			} else {
				$('#btn_edit_save').fadeOut(function() { $(this).removeClass('loading').html('Gem') });
				$('#btn_select_img').html('Brug billede');
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
		},
		imgDelete: function(evt) {
			if (this.view=='gallery') {
				evt.stopPropagation();
				var id = evt.currentTarget.id,
						imgId = id.substr(11);
				this.currentModel = this.collection.get(imgId);
			}
			if(!this.currentModel) return false;
	    if (App.collections.deals.usesImage(this.currentModel.get('n'))) {
	    	new App.views.dialogs.PromtDialog({router:this.router, type: 'promt', callbackCid:this.cid, title:'Slet billede', msg:'Det er ikke muligt at slette billedet, da det bruges af en igangværende eller planlagt deal.', confirmText:'Okay'}); 
	    } else {
		    var confirmer = new App.views.dialogs.PromtDialog({router:this.router, type: 'confirm', callbackCid:this.cid, title:'Slet billede', msg:'Er du sikker på, du ønsker at slette dette billede?<br/>Hvis billedet bliver brugt i deals vil det også blive slettet her.', confirmText:'Slet'}); 
		    this.router.bind('promtCallback:'+this.cid, this.deleteConfirmCallback);
		  }
			return false;
		},
    deleteConfirmCallback:function(obj) {
      var thisClass = this;
      this.router.unbind('promtCallback:'+this.cid);
      if(obj.callbackCid==this.cid&&obj.type=='confirm'&&obj.eventType=='confirm'&&this.currentModel) {
          var id = this.currentModel.id,
              filename = this.currentModel.get('n');
          this.currentModel.destroy({data:id, 
            success:function(model, response) {
              if (response.success=='true') {
	              App.collections.deals.updateImages(filename);
	              $('#img_'+id).remove();
	            } else if (response.error=='img_on_active_deal') {
	            	new App.views.dialogs.PromtDialog({router:thisClass.router, type: 'promt', callbackCid:this.cid, title:'Slet billede', msg:'Det var ikke muligt at slette billedet, da det bruges af en igangværende eller planlagt deal.', confirmText:'Okay'}); 
	            } else thisClass.router.showError("Der opstod en fejl", "Det var ikke muligt at slette billedet<br />Fejlmeddelelse: "+response.error);
            }, 
            error: function(model, response) { 
              log("error delete: ", model, response, id); 
              thisClass.router.showError("Der opstod en fejl", "Det var ikke muligt at slette billedet<br />Fejlmeddelelse: "+response.error);
            }
          });
          thisClass.goGallery();
      }
    }
	});
});