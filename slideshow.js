window.Slideshow = {
	templates : {},
	slides : [],
	index : 0,
	indexEnd : 1337,
	subIndex : 0,
	slideLoaderCounter : 0,
	start : function () {
		this.onHashChange();

		aria.utils.Event.addListener(document, "keyup", {fn:this.onKeyup, scope : this});
		aria.utils.Event.addListener(window, "hashchange", {fn:this.onHashChange, scope : this});
	},

	displaySlide : function (slideIndex, subSlideIndex) {
		var slide = this.slides[slideIndex];
		if (aria.utils.Type.isArray(slide)) {
			slide = slide[subSlideIndex || 0];
		}
		if (typeof slide != 'undefined') {
			var container = document.getElementsByClassName('current')[0];
			var template = this.templates[slide.template];
			container.classList.add('slide');
			container.innerHTML = Mustache.to_html(template, slide);
		} else {
			this.loadSlideData(slideIndex, subSlideIndex);
		}
	},

	onHashChange : function () {
		var indexes = window.location.hash.match(/^[^\d]*(\d+\-\d+)$/);
		if (indexes) {
			var index = indexes[1].split("-")[0] * 1,
			subIndex   = indexes[1].split("-")[1] * 1;

			this.index = index;
			this.subIndex = subIndex;
			
			this.displaySlide(index, subIndex);
		} else {
			this.goToIndex(1,0);
		}
	},

	loadSlideData : function (slideIndex, subSlideIndex) {
		aria.core.IO.asyncRequest({
			url : 'data/slide' + slideIndex + '.json',
			callback : {
				fn : this.onDataLoaded,
				onerror : this.onDataError,
				scope : this,
				args : [slideIndex, subSlideIndex]
			}
		})
	}, 
	
	onDataLoaded: function (response, indexes) {
		var slideIndex = indexes[0],
			subSlideIndex = indexes[1];
		eval('var slide = ' + response.responseText);
		if (!aria.utils.Type.isArray(slide)) {
			slide = [slide];
		} 
		this.slideLoaderCounter = slide.length;
		for (var i = 0 ; i < slide.length ; i++) {
			this.initSlide(slide[i], slideIndex, i);	
		}
		
	},

	onDataError: function (response, indexes) {
		this.back();
		this.indexEnd = indexes[0];
	},

	initSlide : function (slide, slideIndex, subSlideIndex) {
		if (typeof slide.items == 'string') {
			slide.items = [slide.items];
		}
		if (typeof slide.pictures == 'string') {
			slide.pictures = [{url:slide.pictures}];
		}

		var previousSlide = this.slides[slideIndex] ? this.slides[slideIndex][subSlideIndex - 1] : null;
		if (previousSlide) {	
			slide.template = slide.template || previousSlide.template;
			slide.title = slide.title || previousSlide.title;
			
			if (slide.items && previousSlide.items && !slide.overrideItems) {
				slide.items = previousSlide.items.concat(slide.items);
			}

			if (slide.pictures && previousSlide.pictures && !slide.overrideItems) {
				slide.pictures = previousSlide.pictures.concat(slide.pictures);
			}
	
		}
		
		this.slides[slideIndex] = this.slides[slideIndex] || [];
		this.slides[slideIndex][subSlideIndex] = slide;

		if (this.templates[slide.template]) {
			this.notifySlideReady(slideIndex);
		} else {
			var oSelf = this;
			this.loadTemplate(slide.template, function () {
				oSelf.notifySlideReady(slideIndex)
			});
		}
	},

	notifySlideReady : function (slideIndex) {
		this.slideLoaderCounter --;
		if(this.slideLoaderCounter == 0) {
			if (this.subIndex > this.slides[slideIndex].length) {
				this.goToIndex(slideIndex, this.slides[slideIndex].length - 1)
			} else {
				this.displaySlide(slideIndex, this.subIndex);	
			}
		}
	},

	onKeyup : function (event) {
		var keyCode = event.keyCode;
		if (keyCode == 37) { // LEFT ARROW
			if (event.ctrlKey) {
				this.goToPreviousChapter();
			} else {
				this.back();
			}
		} else if (keyCode == 39) { // RIGHT ARROW
			if (event.ctrlKey) {
				this.goToNextChapter();
			} else {
				this.next();
			}
		} else if (keyCode == 66) { // B - Beginning 
			this.goToIndex(1,0);
		}
	},
	
	back : function () {
		if (this.subIndex > 0) {
			this.goToIndex(this.index, this.subIndex - 1);	
		} else if (this.index > 1){
			this.goToIndex(this.index - 1, 1337);
		}
	},
	
	goToPreviousChapter : function () {
		if (this.subIndex > 0) {
			this.goToIndex(this.index, 0);	
		} else if (this.index > 1) {
			this.goToIndex(this.index - 1, 0);
		} 
	},

	next : function () {
		if (this.subIndex < this.slides[this.index].length - 1) {
			this.goToIndex(this.index, this.subIndex + 1);	
		} else {
			this.goToNextChapter();
		}
	},
	
	goToNextChapter : function () {
		if (this.index < this.indexEnd - 1) {
			this.goToIndex(this.index + 1, 0);			
		}
	},

	goToIndex : function (index, subIndex) {
		window.location.hash = index + '-' + subIndex;
	},

	loadTemplate : function(templateName, callback) {
		aria.core.IO.asyncRequest({
			url : 'templates/' + templateName + '.html',
			callback : {
				fn : function (response) {
					this.templates[templateName] = response.responseText;
					callback(this.templates[templateName]);
				},
				scope : this
			}
		})
	},
	
	countSlides : function () {
		var count = 0;
		for (var i = 0 ; i < this.slides.length ; i++) {
			if (this.slides[i])
				count += this.slides[i].length;
		}
		return count;
	}
};