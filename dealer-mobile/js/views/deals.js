App.views.Deals = Backbone.View.extend({
	el: '#deal-slider',
	initialize:function(){
		_.bindAll(this,'render','royalSlider','dealChange','beforeChange','update');
		this.router = this.options.router;
		this.deals = App.collections.deals;
		this.templates = App.collections.templates;
		log(this.templates.toJSON());
		this.templates.on("change:approved add remove",this.changed,this);
		this.deals.on("add remove",this.changed,this);
		this.render(true);
	},
	changed:function(){
		this.render();
	},
	/**
	 * Rendering the deal sliders
	 * @param  {BOOL} first Deciding if it is the first time it gets rendered
	 * @return {[type]}       [description]
	 */
	render: function(first){
		var thisClass = this;
		var data = {templates: this.templates.models };
		$.get('templates/deals.html',function(template){
			if(thisClass.dealSlider) thisClass.dealSlider.destroy();
			$(thisClass.el).html(_.template(template,data));
			thisClass.royalSlider();
		},'html');
	},
	
	update:function(){
		this.dealSlider.updateSliderSize();
	},
	beforeChange: function(){
		this.router.lock();
	},
	dealChange:function(){
		this.router.unlock();
		if(this.currentSlide) this.currentSlide.toggleClass('current',false);

		/* Select the chosen deal(slide) */
		var currSlideNum	= this.dealSlider.currentSlideId;
		var slideSelector	= '.royalSlide:nth-child(' + (currSlideNum + 1) + ')';
		this.currentSlide	= $(slideSelector, this.dealSliderEl).toggleClass('current',true);
		var templateId		= $(slideSelector + ' .deal').attr('templateId');
		this.router.changedToTemplate(templateId);
	},


	royalSlider:function(){
		log(this.el);
		this.dealSlider = $('#sliderEl').royalSlider({
    		directionNavEnabled: false,
    		slideTransitionSpeed: 800,
    		slideTransitionEasing: 'easeInOutExpo',
    		controlNavEnabled: true,
    		autoScaleSlider: true,
    		autoScaleSliderWidth: 320,
    		autoScaleSliderHeight: 110,
    		dragUsingMouse: false,
    		disableTranslate3d: false,
    		beforeSlideChange: this.beforeChange,
    		afterSlideChange: this.dealChange,
    		allComplete: this.update
    	}).data('royalSlider');
	},	
});