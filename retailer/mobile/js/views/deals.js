App.views.Deals = Backbone.View.extend({
	el: '#deal-slider',
	initialize:function(){
		_.bindAll(this,'render','royalSlider','dealChange','beforeChange','update');
		this.router = this.options.router;
		this.activeTemplateId = (this.options.activeTemplateId) ? this.options.activeTemplateId : 0;
		this.deals = App.collections.deals;
		this.startedDeals = this.deals.startedDeals();
		this.templates = App.collections.templates;
		log(this.templates.toJSON());
		this.templates.on("change:approved add remove",this.changed,this);
		this.deals.on("add remove",this.changed,this);
		this.render();
	},
	changed:function(p1,p2,p3,p4){
		//log('testing changed',p1,p2,p3,p4);
		this.render(this.activeTemplateId);
	},
	/**
	 * Rendering the deal sliders
	 * @param  {BOOL} first Deciding if it is the first time it gets rendered
	 * @return {[type]}       [description]
	 */
	render: function(templateId){
		var thisClass = this;

		var data = {startedDeals: this.startedDeals, templates: this.templates };
		$.get(ROOT_URL+'templates/deals.html',function(template){
			//log('test after templates');
			if(thisClass.dealSlider) thisClass.dealSlider.destroy();
			$(thisClass.el).html(_.template(template,data));
			thisClass.royalSlider(thisClass.activeTemplateId);
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
		this.activeTemplateId = templateId;
		this.router.navigate('skabeloner/'+templateId,{trigger:true});
		//this.router.changedToTemplate(templateId);
	},


	royalSlider:function(templateId,index){
		//log('templateId',templateId);
		if(!templateId) templateId = 0;
		if(!index){ 
			index = $('#rSS article[templateId='+templateId+']').parent().index();
			index = (index != -1) ? index : 0;
		}
		else index = templateId;
		this.dealSlider = $('#sliderEl').royalSlider({
			directionNavEnabled: false,
			slideTransitionSpeed: 800,
			slideTransitionEasing: 'easeInOutExpo',
			controlNavEnabled: true,
			autoScaleSlider: true,
			startSlideIndex: index,
			autoScaleSliderWidth: 320,
			autoScaleSliderHeight: 110,
			dragUsingMouse: true,
			disableTranslate3d: false,
			beforeSlideChange: this.beforeChange,
			afterSlideChange: this.dealChange,
			allComplete: this.update
		}).data('royalSlider');
	}	
});