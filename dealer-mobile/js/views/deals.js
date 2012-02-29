
App.views.Deals = Backbone.View.extend({
	el: '#deal-slider',
	initialize:function(){
		_.bindAll(this,'render','royalSlider','dealChange','update');
		this.router = this.options.router;
		this.deals = App.collections.deals;
		this.templates = App.collections.templates;
		this.render();
	},
	render: function(){
		var thisClass = this;
		var data = {templates: this.templates.toJSON(), deals: this.deals.toJSON()};
		$.get('templates/deals.html',function(template){
			$(thisClass.el).children().html(_.template(template,data));
			thisClass.royalSlider();
		},'html');
	},
	
	update:function(){
		this.dealSlider.updateSliderSize();
	},
	dealChange:function(){
		if(this.currentSlide) this.currentSlide.toggleClass('current',false);

		/* Select the chosen deal(slide) */
		var currSlideNum	= this.dealSlider.currentSlideId;
		var slideSelector	= '.royalSlide:nth-child(' + (currSlideNum + 1) + ')';
		this.currentSlide	= $(slideSelector, this.dealSliderEl).toggleClass('current',true);
		var templateId		= $(slideSelector + ' .deal').attr('templateId');
		
		this.router.changedToTemplate(templateId);
	},


	royalSlider:function(){
		this.dealSlider = $(this.el).royalSlider({
    		directionNavEnabled: false,
    		slideTransitionSpeed: 800,
    		slideTransitionEasing: 'easeInOutExpo',
    		controlNavEnabled: true,
    		autoScaleSlider: true,
    		autoScaleSliderWidth: 320,
    		autoScaleSliderHeight: 110,
    		dragUsingMouse: false,
    		disableTranslate3d: false,
    		afterSlideChange: this.dealChange,
    		allComplete: this.update
    	}).data('royalSlider');
	},	
});