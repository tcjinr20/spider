/**
 * Created by Administrator on 2017/10/22.
 */

layui.use("jquery",function(){
    var $=layui.jquery;
    $('#sidebar').hide();
    $(".smenu").click(function(){
        $('#sidebar').toggle()
    })
    var meshCount =1;
    var lightCount =1;
    var add = $('.sub.add');
    var offy=add.height();
    var offw =add.width();

    $('.subul').css({'bottom':offy,width:offw});
    $('.sub.add').click(function(){
        $('.subul').toggle();
    })

    $('.subul li').click(function(e){
        $('.subul').toggle();
        var ll=e.target.classList;
        if(ll.contains('group')){
            var mesh = new THREE.Group();
            mesh.name = 'Group ' + ( ++ meshCount );
            editor.execute( new AddObjectCommand( mesh ) );
        }else if(ll.contains('Plane')){
            var geometry = new THREE.PlaneBufferGeometry( 2, 2 );
            var material = new THREE.MeshStandardMaterial();
            var mesh = new THREE.Mesh( geometry, material );
            mesh.name = 'Plane ' + ( ++ meshCount );
            editor.execute( new AddObjectCommand( mesh ) );
        }else if(ll.contains('Box')){
            var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
            var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
            mesh.name = 'Box ' + ( ++ meshCount );
            editor.execute( new AddObjectCommand( mesh ) );
        }else if(ll.contains('Circle')){
            var radius = 1;
            var segments = 32;
            var geometry = new THREE.CircleBufferGeometry( radius, segments );
            var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
            mesh.name = 'Circle ' + ( ++ meshCount );
            editor.execute( new AddObjectCommand( mesh ) );
        }else if(ll.contains('Cylinder')){
            var radiusTop = 1;
            var radiusBottom = 1;
            var height = 2;
            var radiusSegments = 32;
            var heightSegments = 1;
            var openEnded = false;
            var geometry = new THREE.CylinderBufferGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded );
            var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
            mesh.name = 'Cylinder ' + ( ++ meshCount );
            editor.execute( new AddObjectCommand( mesh ) );
        }else if(ll.contains('Icosahedron')){
            var radius = 1;
            var detail = 2;
            var geometry = new THREE.IcosahedronGeometry( radius, detail );
            var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
            mesh.name = 'Icosahedron ' + ( ++ meshCount );
            editor.execute( new AddObjectCommand( mesh ) );
        }else if(ll.contains('Torus')){
            var radius = 2;
            var tube = 1;
            var radialSegments = 32;
            var tubularSegments = 12;
            var arc = Math.PI * 2;
            var geometry = new THREE.TorusBufferGeometry( radius, tube, radialSegments, tubularSegments, arc );
            var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
            mesh.name = 'Torus ' + ( ++ meshCount );
            editor.execute( new AddObjectCommand( mesh ) );
        }else if(ll.contains('TorusKnot')){
            var radius = 2;
            var tube = 0.8;
            var tubularSegments = 64;
            var radialSegments = 12;
            var p = 2;
            var q = 3;
            var geometry = new THREE.TorusKnotBufferGeometry( radius, tube, tubularSegments, radialSegments, p, q );
            var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
            mesh.name = 'TorusKnot ' + ( ++ meshCount );
            editor.execute( new AddObjectCommand( mesh ) );
        }else if(ll.contains('Teapot')){
            var size = 10;
            var segments = 10;
            var bottom = true;
            var lid = true;
            var body = true;
            var fitLid = false;
            var blinnScale = true;
            var material = new THREE.MeshStandardMaterial();
            var geometry = new THREE.TeapotBufferGeometry( size, segments, bottom, lid, body, fitLid, blinnScale );
            var mesh = new THREE.Mesh( geometry, material );
            mesh.name = 'Teapot ' + ( ++ meshCount );
            editor.execute( new AddObjectCommand( mesh ) );
        }else if(ll.contains('Sprite')){
            var sprite = new THREE.Sprite( new THREE.SpriteMaterial() );
            sprite.name = 'Sprite ' + ( ++ meshCount );
            editor.execute( new AddObjectCommand( sprite ) );
        }else if(ll.contains('PointLight')){
            var color = 0xffffff;
            var intensity = 1;
            var distance = 0;
            var light = new THREE.PointLight( color, intensity, distance );
            light.name = 'PointLight ' + ( ++ lightCount );
            editor.execute( new AddObjectCommand( light ) );
        }else if(ll.contains('SpotLight')){
            var color = 0xffffff;
            var intensity = 1;
            var distance = 0;
            var angle = Math.PI * 0.1;
            var penumbra = 0;
            var light = new THREE.SpotLight( color, intensity, distance, angle, penumbra );
            light.name = 'SpotLight ' + ( ++ lightCount );
            light.target.name = 'SpotLight ' + ( lightCount ) + ' Target';
            light.position.set( 5, 10, 7.5 );
            editor.execute( new AddObjectCommand( light ) );
        }else if(ll.contains('DirectionalLight')){
            var color = 0xffffff;
            var intensity = 1;
            var light = new THREE.DirectionalLight( color, intensity );
            light.name = 'DirectionalLight ' + ( ++ lightCount );
            light.target.name = 'DirectionalLight ' + ( lightCount ) + ' Target';
            light.position.set( 5, 10, 7.5 );
            editor.execute( new AddObjectCommand( light ) );
        }else if(ll.contains('HemisphereLight')){
            var skyColor = 0x00aaff;
            var groundColor = 0xffaa00;
            var intensity = 1;
            var light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
            light.name = 'HemisphereLight ' + ( ++ lightCount );
            light.position.set( 0, 10, 0 );
            editor.execute( new AddObjectCommand( light ) );
        }else if(ll.contains('AmbientLight')){
            var color = 0x222222;
            var light = new THREE.AmbientLight( color );
            light.name = 'AmbientLight ' + ( ++ lightCount );
            editor.execute( new AddObjectCommand( light ) );
        }
    })
    $('.setting').click(function(){

    })
    $(".play").click(function(e){
        if($(e.target).text()=="play"){
            $(e.target).html('stop');
            editor.signals.startPlayer.dispatch();
        }else{
            $(e.target).html('play');
            editor.signals.stopPlayer.dispatch();
        }

    })
})