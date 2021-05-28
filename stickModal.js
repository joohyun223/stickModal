(function(window){
  
  const modalConfig = {
    template: {
      entry: {
        className: 'stick-modal',
        tag: 'div',
        style: "border: solid 1px #777;padding: 10px;border-radius: 8px;width: 400px;min-height: 100px;position: fixed;background: white;z-index: 10000;top: 29%;left: 49%;box-sizing: border-box;",
        cont: ['modal_header', 'modal_body', 'modal_footer']
      },
      modal_header: {
        className: 'modal_header',
        tag: 'div',
        style: "height:23px; padding-bottom: 10px; font-size: 1rem;",
        cont: ['header_sub' , 'header_close']
      },
      modal_body: {
        className: 'modal_body',
        tag: 'div',
        style: "text-align: center;padding: 25px 0px; border-bottom: solid 1px #EEE; border-top: solid 1px #EEE;",
        cont: ['modal_contents'],
      },
      modal_contents: {
        className: '',
        tag: 'p',
        style:'font-size: 1.3rem;',
        cont: 'contents'
      },
      header_sub: {
        tag: 'div',
        className: '',
        style:'display:inline-block',
        cont: 'subject',
        display: 'show'
      },
      header_close: {
        className: 'modal-header-close',
        tag: 'button',
        style: 'position:absolute; right:10px; margin: 0px 5px; padding: 5px 10px;border-radius: 5px;border: solid 1px #007bff;background: #007bff;color: white;',
        cont: 'X',
      },
      modal_footer: {
        className: 'modal_footer',
        tag: 'div',
        style: "padding-top: 10px;text-align: center;position: relative;",
        cont: ['footer_confirm', 'footer_cancel'],
      },
      footer_confirm: {
        className: 'modal-footer_confirm',
        tag: 'button',
        style: 'bottom: 10px; margin: 0px 5px;padding: 5px 10px;border-radius: 5px;border: solid 1px #007bff;background: #007bff;color: white;',
        cont: 'confirm',
      },
      footer_cancel: {
        className: 'modal-footer_cancel',
        tag: 'button',
        style: 'bottom: 10px; margin: 0px 5px; padding: 5px 10px;border-radius: 5px;border: solid 1px #007bff;background: #007bff;color: white;',
        cont: 'cancel',
      },
    }
  }

  class Modal{
    constructor($app, config, methods){
      this.$app = $app;
      this.$template = this.extend(true, modalConfig.template, config);
      this.$entryEl = this.createElem($app, modalConfig.template.entry);
      this.$on = methods.on;
      this.$template.entry.cont.forEach((itm)=>{
        this.recursive(this.$entryEl, this.$template[itm]);
      })
  
      this.initComplete();
    }
  
    recursive(appendEl, prop){
      if(Array.isArray(prop)){
        prop.forEach((itm)=>{
          if(this.$template[itm] === undefined){
            this.createElem(appendEl, itm);
            return;
          }
          if(this.$template[itm].tag === undefined){
            this.createElem(appendEl, this.$template[itm].cont);
            return;
          }
          this.recursive(appendEl, this.$template[itm]);
        })
        return;
      }
      let createdEl = this.createElem(appendEl, prop);
      if(prop.cont===undefined){
        return;
      }
      this.recursive(createdEl, prop.cont);
    }
    
    createElem(appendedEl, prop){
      if(typeof prop ==='string'){
        appendedEl.append(prop);
        return;
      }
      let elem = document.createElement(prop.tag);
      if(prop.event){
        elem.addEventListener(prop.event.type , prop.event.do.bind(this));
      }
      elem.style.cssText = prop.style;
      console.log('ㅁㅁ' , elem);
      if(prop.display === 'none'){
        elem.style.display ='none'
      }
      elem.className= (prop.className)?prop.className:"";
      appendedEl.append(elem);
      return elem;
    }
  
    initComplete(){
      this.$on.init.call(this);
    }
  
    destroy(){
      this.$entryEl.remove();
      this.$on.destroy.call(this);
    }

    extend(){
      let extended = {};
      let deep = false;
      let i = 0;
      let length = arguments.length;
      let _self = this;
      
      // Check if a deep merge
      if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
        deep = arguments[0];
        i++;
      }
    
      // Merge the object into the extended object
      let merge = function (obj) {
        for ( let prop in obj ) {
          if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
            // If deep merge and property is an object, merge properties
            if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
              extended[prop] = _self.extend( true, extended[prop], obj[prop] );
            } else {
              extended[prop] = obj[prop];
            }
          }
        }
      };
    
      // Loop through each object and conduct a merge
      for ( ; i < length; i++ ) {
        let obj = arguments[i];
        merge(obj);
      }
    
      return extended;
    }
  }

  window.stickModal = Modal;
  
})(window);