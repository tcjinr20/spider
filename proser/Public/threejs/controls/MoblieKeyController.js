/**
 * Created by Administrator on 2017/10/28.
 */

THREE.MoblieKeyController = function (keydown,keyup) {
    this.keydown=keydown?keydown:function(){};
    this.keyup=keyup?keyup:function(){};
    this.keys = { SP : 32, W : 87, A : 65, S : 83, D : 68, UP : 38, LT : 37, DN : 40, RT : 39 };

    var item = '\
        <div class="up" style="position: absolute;width: 50px;height: 50px;text-align: center;line-height: 50px;top: 0;left:25px">&uarr;</div>\
    <div class="right" style="position: absolute;width: 50px;height: 50px;text-align: center;line-height: 50px;top: 25px;left: 50px;">&rarr;</div>\
    <div class="down" style="position: absolute;width: 50px;height: 50px;text-align: center;line-height: 50px;top: 50px;left: 25px;">&darr;</div>\
    <div class="left" style="position: absolute;width: 50px;height: 50px;text-align: center;line-height: 50px;top: 25px;left: 0px;">&larr;</div>\
   ';
    this.rightPan =document.createElement('div');
    this.rightPan.style="position: absolute;z-index:9999;background: red;width: 100px;height: 100px;border-radius: 50px;overflow: hidden;bottom:0px";
    this.rightPan.innerHTML=item
    document.body.appendChild(this.rightPan);

    this.leftPan = document.createElement('div');
    this.leftPan.style="position: absolute;z-index:9999;background: red;width: 100px;height: 100px;border-radius: 50px;overflow: hidden;bottom:0px;right:0px";
    this.leftPan.innerHTML=item
    document.body.appendChild(this.leftPan);
    var keyState = {};
    this.enable =false;

    this.mousedown = function( event ) {
        this.enable =true;
        var angle=this.cAngle(event);
        if(angle>=-135&&angle<-45){
            if(event.currentTarget==this.rightPan)
            {
                keyState[this.keys.W]=1;
            }else{
                keyState[this.keys.UP]=1;
            }
        }else if(angle>=45&&angle<135){
            if(event.currentTarget==this.rightPan)
            {
                keyState[this.keys.S]=1;
            }else{
                keyState[this.keys.DN]=1;
            }
        }else if(angle>=-45&&angle<45){
            if(event.currentTarget==this.rightPan)
            {
                keyState[this.keys.D]=1;
            }else{
                keyState[this.keys.LT]=1;
            }
        }else{
            if(event.currentTarget==this.rightPan)
            {
                keyState[this.keys.A]=1;
            }else{
                keyState[this.keys.RT]=1;
            }
        }
    };

    this.mousemove = function( event ) {
        if(!this.enable)return;
        event.preventDefault();
        event.stopPropagation();
        var angle=this.cAngle(event);
        if(angle>=-135&&angle<-45){
            if(event.currentTarget==this.rightPan)
            {
                keyState[this.keys.W]=1;
            }else{
                keyState[this.keys.UP]=1;
            }
        }else if(angle>=45&&angle<135){
            if(event.currentTarget==this.rightPan)
            {
                keyState[this.keys.S]=1;
            }else{
                keyState[this.keys.DN]=1;
            }
        }else if(angle>=-45&&angle<45){
            if(event.currentTarget==this.rightPan)
            {
                keyState[this.keys.D]=1;
            }else{
                keyState[this.keys.LT]=1;
            }
        }else{
            if(event.currentTarget==this.rightPan)
            {
                keyState[this.keys.A]=1;
            }else{
                keyState[this.keys.RT]=1;
            }
        }
    };

    this.mouseup = function( event ) {
        this.enable =false;
        event.preventDefault();
        event.stopPropagation();
        var angle=this.cAngle(event);
        if(angle>=-135&&angle<-45){
            if(event.currentTarget==this.rightPan)
            {
                keyState[this.keys.W]=0;
            }else{
                keyState[this.keys.UP]=0;
            }
        }else if(angle>=45&&angle<135){
            if(event.currentTarget==this.rightPan)
            {
                keyState[this.keys.S]=0;
            }else{
                keyState[this.keys.DN]=0;
            }
        }else if(angle>=-45&&angle<45){
            if(event.currentTarget==this.rightPan)
            {
                keyState[this.keys.D]=0;
            }else{
                keyState[this.keys.LT]=0;
            }
        }else{
            if(event.currentTarget==this.rightPan)
            {
                keyState[this.keys.A]=0;
            }else{
                keyState[this.keys.RT]=0;
            }
        }
    };


    this.getContainerDimensions = function(tar) {

        if ( tar != document ) {
            return {
                size	: [ tar.offsetWidth, tar.offsetHeight ],
                offset	: [ tar.offsetLeft,  tar.offsetTop ],
            };
        } else {
            return {
                size	: [ window.innerWidth, window.innerHeight ],
                offset	: [ 0, 0 ]
            };
        }
    };

    this.cAngle=function (event){
        var container = this.getContainerDimensions(event.currentTarget);
        var halfWidth  = container.size[ 0 ] / 2;
        var halfHeight = container.size[ 1 ] / 2;

        var xx =event.pageX-container.offset[ 0 ]-halfWidth;
        var yy =event.pageY - container.offset[ 1 ]- halfHeight;
        return Math.atan2(yy,xx)*180/Math.PI;
    }

    function bind( scope, fn ) {

        return function () {

            fn.apply( scope, arguments );

        };

    }

    function contextmenu( event ) {
        event.preventDefault();
    }

    this.dispose = function() {
        this.enable =false;
        this.rightPan.removeEventListener( 'contextmenu', contextmenu, false );
        this.rightPan.removeEventListener( 'mousedown', _mousedown, false );
        this.rightPan.removeEventListener( 'mousemove', _mousemove, false );
        this.rightPan.removeEventListener( 'mouseup', _mouseup, false );
        this.leftPan.removeEventListener( 'contextmenu', contextmenu, false );
        this.leftPan.removeEventListener( 'mousedown', _mousedown, false );
        this.leftPan.removeEventListener( 'mousemove', _mousemove, false );
        this.leftPan.removeEventListener( 'mouseup', _mouseup, false );
    };

    var _mousemove = bind( this, this.mousemove );
    var _mousedown = bind( this, this.mousedown );
    var _mouseup = bind( this, this.mouseup );
    this.rightPan.addEventListener( 'contextmenu', contextmenu, false );
    this.rightPan.addEventListener( 'mousemove', _mousemove, false );
    this.rightPan.addEventListener( 'mousedown', _mousedown, false );
    this.rightPan.addEventListener( 'mouseup',   _mouseup, false );

    this.leftPan.addEventListener( 'contextmenu', contextmenu, false );
    this.leftPan.addEventListener( 'mousemove', _mousemove, false );
    this.leftPan.addEventListener( 'mousedown', _mousedown, false );
    this.leftPan.addEventListener( 'mouseup',   _mouseup, false );
    var self = this;
    setInterval(function(){
        for(var s in keyState){
            if(keyState[s]==1){
                self.keydown(s)
            }else{
                self.keyup(s);
                delete keyState[s];
            }
        }
    },100);

};
