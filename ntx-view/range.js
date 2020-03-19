// Updated: 20.11.19
// Updated: 11.03.20 -this.stopOnLine added
// Updated: 13.03.20 -moveToValue corrected

class Range extends Control{
    _init(){
        this.title = "";
        this.prefix = null;
        this.postfix = null;
        this.min = 0;
        this.max = 100;
		this.step = 1;
        this.valueSettable = false;
		this.moved = false;
        this.value = 55;
		this.isMobile = false;
        this.onChange = ()=>{};
		this.newPos = "screenX";
		this.startRange = 55;
		this.isVertical = false;
		this.leftEdge = -1;
		this.rightEdge = null;
		this.startRangeMove = this.startRangeMove.bind(this);
		this.rangeMove = this.rangeMove.bind(this);
		this.endRangeMove = this.endRangeMove.bind(this);
		this.plusStep = this.plusStep.bind(this);
		this.minusStep = this.minusStep.bind(this);
		this.stopOnLine = this.stopOnLine.bind(this);
    }
	
    _apply(params){
        if(params.title) this.title = params.title;
        if(params.prefix) this.prefix = params.prefix;
        if(params.postfix) this.postfix = params.postfix;
        if(params.min) this.min = params.min;
        if(params.max) this.max = params.max;
        if(params.valueSettable) this.valueSettable = params.valueSettable;
        if(params.value) this.value = params.value;
        if(params.onChange) this.onChange = params.onChange;
		if(params.isMobile) this.isMobile = params.isMobile;
		if(params.isVertical) this.isVertical = params.isVertical; 
    }
	
    _render(container){
        this._dom.holder = document.createElement("ntx-range");
        container.append(this._dom.holder);
    }
	
    _update(){
        this._dom.holder.innerHTML = "";
        // Нарисовать элемент текстового заголовка
        this.titleDiv = document.createElement("range-title");
        this._dom.holder.append(this.titleDiv);
        if(this.title) this.titleDiv.innerHTML = this.title + ":";
        // Нарисовать элемент для значения скорости
        this.speedDisplay = document.createElement("speed-display");
        if(this.valueSettable) this.speedDisplay.setAttribute("contenteditable",true);
        this.speedDisplay.innerHTML = this.value;
        
        this.titleDiv.append(this.speedDisplay);
        // Нарисовать предшествующий прокрутке элемент
        if(this.prefix && this.prefix instanceof Control) this.prefix.render(this._dom.holder);
        // Нарисовать элемент прокрутки
        this.rangeLine = document.createElement("range-line");
		this.rangeLine.addEventListener("click",this.stopOnLine);
        this.preLine = document.createElement("pre-line");
        this.postLine = document.createElement("post-line");
        this.rangeBar = document.createElement("range-bar");
		if(this.isMobile) this.rangeBar.addEventListener("touchstart",this.startRangeMove);
		else this.rangeBar.addEventListener("mousedown",this.startRangeMove);
        this.rangeLine.append(this.preLine, this.rangeBar);
        this._dom.holder.append(this.rangeLine);
        // Нарисовать последующий за прокруткой элемент
        if(this.postfix && this.postfix instanceof Control) this.postfix.render(this._dom.holder);
		this.rightEdge = this.rangeLine.getBoundingClientRect().width - 16;
		this.moveToValue();
	}
	
	stopOnLine(e){
		for(let p of e.path) if(p === this.rangeBar) return;
		if(this.moved) return;
		let value = ((e.offsetX<this.rightEdge) ? e.offsetX : this.rightEdge) ;
		this.rangeBar.style.marginLeft = value-4 + "px";
		this.preLine.style.width = value+ "px";
		this.refreshValue(value);
	}
	
	startRangeMove(e){
		let event;
		if(e instanceof TouchEvent) event = e.touches[0];
		else event = e;
		this.startPos = event[this.newPos];
		this.startRange = parseInt(this.rangeBar.style.marginLeft);
		//if(!isNaN(this.startRange))this.startPos = this.startRange;
		if(this.isMobile){
			addEventListener("touchend",this.endRangeMove);
			addEventListener("touchmove", this.rangeMove);
		}
		else{
			addEventListener("mouseup",this.endRangeMove);
			addEventListener("mousemove", this.rangeMove);
		}
	}
	
	refreshValue(value){
		let _v = Math.round(value/270*100)+8;
		if(_v>100)_v = 100;
		if(_v<0) _v = 0;
		this.value = _v;
	}
	
	rangeMove(e){
		let newCoord;
		if(e instanceof TouchEvent) newCoord = e.touches[0];
		else newCoord = e;
		this.moved = true;
		let newVal = (this.startRange?this.startRange:0) 
			+ newCoord[this.newPos] - this.startPos;
		if(newVal<this.barStartPoint)newVal = this.barStartPoint;
		else if(newVal<this.barStartPoint)newVal = this.barStartPoint;
		let value = (newVal>this.rightEdge)?
							this.rightEdge : (newVal<this.leftEdge)? 
									this.leftEdge : newVal;
		this.rangeBar.style.marginLeft = value-4 + "px";
		this.rangeBar.classList.add("active");
		this.preLine.style.width = value + "px";
		this.refreshValue(value);
	}
	
	plusStep(){
		let newValue = this.value + this.step;
		if(newValue < this.max) this.value = newValue;
		this.moveToValue();
	}
	
	minusStep(){
		let newValue = this.value - this.step;
		if(newValue > this.min) this.value = newValue;
		this.moveToValue();
	}
	
	moveToValue(){
		let width = this.rangeLine.getBoundingClientRect().width-12;
		let range = this.max - this.min;
		let value = parseInt(width * this.value/100)-15;
		this.preLine.style.width = value + "px";
		this.rangeBar.style.marginLeft = value -4+ "px";
	}
	
	endRangeMove(){
		this.rangeBar.classList.remove("active");
		if(this.isMobile) {
			removeEventListener("touchend",this.endRangeMove);
			removeEventListener("touchmove", this.rangeMove);
		}
		else{
			removeEventListener("mouseup",this.endRangeMove);
			removeEventListener("mousemove", this.rangeMove);
		}
		this.moved = false;
	}
	
	get isVertical(){ return this._isVertical; }
	set isVertical(value){ 
		this._isVertical = value;
		if(value === true) this.newPos = "screenY";
		else this.newPos = "screenX";
	}
	
    get value(){ return this._value; }
    set value(value){
        if(!isNaN(value) && value !== this._value && value >= this.min && value<=this.max){
            this._value = value;
			if(this.stage) this.speedDisplay.innerHTML = value;
            if(this.onChange instanceof Function )this.onChange();
        }
    }
	
	get prefix(){ return this._prefix; }
	set prefix(value){ this._prefix = value; }
	
	get postfix(){ return this._postfix; }
	set postfix(value){ this._postfix = value; }
}