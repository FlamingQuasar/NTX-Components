// Updated 19.11.19
class Control{
	constructor(params = {}){
		this.freeze = true;
		this._enabled = true;
		this._stage = false;
		this._dom = {};
		this._classes = [];
		this.value = null;
		this.callback = null;
        this._init();
        this.apply(params);
        this.freeze = false;
	}
	// Инициализировать компонент стартовыми значениями
	_init() {}

	// Применить к компоненту набор параментов
    apply(params) {
        if ( typeof params.value !== 'undefined' ) this.value = params.value;
        if ( params.classes) this.classes = params.classes;
        if ( typeof params.visible !== 'undefined' ) this.visible = params.visible;
        if ( typeof params.enabled !== 'undefined' ) this.enabled = params.enabled;
        if ( params.callback ) this.callback = params.callback;
        this._apply(params);
    }
	_apply() {}
	
	// Нарисовать компонент в элементе Container
	render(container) {
        if ( this._stage ) throw Error('Элемент уже отрисован в DOM');
        if ( this._freeze ) return;
        if ( !(container instanceof Node) && container !== null ) throw TypeError('Тип параметра <container> должен быть <Node> или <null>');
        this._render(container);
        this._stage = true;
        this.update();
    }
	_render(container){}
	
	// Обновить компонент в соответствии с параметрами
	update(){
        if ( !this.stage || this.freeze ) return;
		for(let c of this.classes) this._dom.holder.classList.add(c);
		this._update(); 
	}
	_update(){}
	
	// Разместить копию компонента с элементе container
	clone(container){
		this._clone();
	}
	_clone(){}

	// Удалить все элементы компонента
	clearAll(){
		this._clearAll();
		this.stage = false;
	}
	_clearAll(){}

	// Удалить элементы компонента
	clear(){
		this._clear();
		this._stage = false;
	}
	_clear(){}
	
	// Очистить свойства экземпляра
	destroy(){
		if ( !this.stage ) throw Error('Элемент не отрисован в DOM');
        this._clear();
        for ( let i in this._dom ) { 
			this._dom[i].remove(); 
			delete(this._dom[i]);
		}
        this._stage = false;
    }
	_destroy(){}
	
	setBoolean(prop, value){
		if(typeof value === "boolean") {
			this["_" + prop] = value;
			return true;
		}
		else{
			console.warn("Значение свойства " + prop + " должно являться переменной типа Boolean");
			return false;
		}
	}
	
	get value(){ return this._value }
	set value(value){
		this._value = value;
		if(this.callback) this.callback(value);
	}
	get dom(){ return this._dom }
	set dom(value){ this._dom = value }
	get classes(){ return this._classes }
	set classes(value){
		if(typeof value === "string") {
			for(let i of this._classes ) if (value === i) return;
			this._classes.push( value );
		}
		else if(value && value.length > 0){
			for(let w of value){
				if(typeof w === "string") this._classes.push( w );
			}
		}
		else this._classes = [];
		if(this.stage && this._dom && this._dom.holder) this._dom.holder.classList = this.classes;
	}
	get freeze(){ return this._freeze }
	set freeze(value){ this.setBoolean("freeze", value) }
	get stage(){ return this._stage }
	set stage(value){ this.setBoolean("stage", value) }
	get visible(){ return this._visible }
	set visible(value){
		if(this.setBoolean("visible", value)){
			if(value){
				let _arr = [], found = false;
				if(this._dom && this._dom.holder && this._dom.holder.classList) 
					this._dom.holder.classList.remove("hidden");
				for(let i of this.classes){
					if(i !== "hidden" )_arr.push(i);
					else found = true;
				}
				if(found) this.classes = _arr;
			}
		}
	} 
	get enabled(){ return this._enabled }
	set enabled(value){ this.setBoolean("enabled", value) }
}