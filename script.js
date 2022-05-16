

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();

function init(){
    renderer.setSize( window.innerWidth, window.innerHeight );
    window.addEventListener('resize', handleWindowResize, false);
    document.body.appendChild( renderer.domElement );
    
    animate();
}


const clock = new THREE.Clock()

const W = new THREE.MeshBasicMaterial({color: 0xffffff });
const O = new THREE.MeshBasicMaterial({color: 0xffa500 });
const R = new THREE.MeshBasicMaterial({color: 0xff0000 });
const G = new THREE.MeshBasicMaterial({color: 0x00ff00 });
const B = new THREE.MeshBasicMaterial({color: 0x0000ff });
const Y = new THREE.MeshBasicMaterial({color: 0xffff00 });

const K = new THREE.MeshPhongMaterial({
    color: 0x771177 , 
    emissive: 0x111133,
    shininess: 40,
    specular: 0x171717,
});

const lineMat = new THREE.LineBasicMaterial( { color: 0x000000 } );

geometry = new THREE.CircleGeometry( 10, 64 );
groundMirror = new Reflector( geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777
} );
groundMirror.position.z = 0.1

statics = new THREE.Group()
statics.add( groundMirror );

const planeGeo = new THREE.PlaneGeometry(100, 100)
const planeBottom = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( {
    color: 0x444444,
    emissive: 0x333333
}));
statics.add( planeBottom );

statics.position.y = -4;
statics.rotateX( - Math.PI / 2 );

scene.add(statics)


function create_cube(size, materials){
    // faces are front back up down left right
    size *= 0.6
    const geo = new THREE.BoxGeometry(size, size, size);
    const cube = new THREE.Group();
    const mesh = new THREE.Mesh( geo, materials );
    const edges = new THREE.EdgesGeometry( geo );
    const line = new THREE.LineSegments( edges,  lineMat);
    cube.add( line );
    cube.add( mesh );
    return cube
}

class Rubik{
    constructor(size){
        this.size = size
        this.pivot_mesh = new THREE.Group();
        this.rubik_mesh = new THREE.Group();
    
        const cube_list = [];
        this.center_cubes = {};

        // Right
        var cube = create_cube(size, [K, G, K, Y, K, O]);
        cube.position.copy(new THREE.Vector3(0, 0, 0).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [K, K, K, Y, K, O]);
        cube.position.copy(new THREE.Vector3(1, 0, 0).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [B, K, K, Y, K, O]);
        cube.position.copy(new THREE.Vector3(2, 0, 0).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);

        var cube = create_cube(size, [K, G, K, K, K, O]);
        cube.position.copy(new THREE.Vector3(0, 1, 0).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [K, K, K, K, K, O]);
        cube.position.copy(new THREE.Vector3(1, 1, 0).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.center_cubes.O = cube;
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [B, K, K, K, K, O]);
        cube.position.copy(new THREE.Vector3(2, 1, 0).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);

        var cube = create_cube(size, [K, G, W, K, K, O]);
        cube.position.copy(new THREE.Vector3(0, 2, 0).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [K, K, W, K, K, O]);
        cube.position.copy(new THREE.Vector3(1, 2, 0).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [B, K, W, K, K, O]);
        cube.position.copy(new THREE.Vector3(2, 2, 0).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);


        // Middle
        var cube = create_cube(size, [K, G, K, Y, K, K]);
        cube.position.copy(new THREE.Vector3(0, 0, 1).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [K, K, K, Y, K, K]);
        cube.position.copy(new THREE.Vector3(1, 0, 1).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.center_cubes.Y = cube;
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [B, K, K, Y, K, K]);
        cube.position.copy(new THREE.Vector3(2, 0, 1).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);

        var cube = create_cube(size, [K, G, K, K, K, K]);
        cube.position.copy(new THREE.Vector3(0, 1, 1).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.center_cubes.G = cube;
        this.rubik_mesh.add(cube);
        // var cube = create_cube(size, [K, K, K, K, K, K]);
        // cube.position.copy(new THREE.Vector3(1, 1, 1).multiplyScalar(size).addScalar(size/2.0));
        // cube_list.push(cube)
        // this.rubik_mesh.add(cube);
        var cube = create_cube(size, [B, K, K, K, K, K]);
        cube.position.copy(new THREE.Vector3(2, 1, 1).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube);
        this.center_cubes.B = cube;
        this.rubik_mesh.add(cube);

        var cube = create_cube(size, [K, G, W, K, K, K]);
        cube.position.copy(new THREE.Vector3(0, 2, 1).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [K, K, W, K, K, K]);
        cube.position.copy(new THREE.Vector3(1, 2, 1).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.center_cubes.W = cube;
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [B, K, W, K, K, K]);
        cube.position.copy(new THREE.Vector3(2, 2, 1).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube);
        this.rubik_mesh.add(cube);


        // Top
        var cube = create_cube(size, [K, G, K, Y, R, K]);
        cube.position.copy(new THREE.Vector3(0, 0, 2).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [K, K, K, Y, R, K]);
        cube.position.copy(new THREE.Vector3(1, 0, 2).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [B, K, K, Y, R, K]);
        cube.position.copy(new THREE.Vector3(2, 0, 2).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);

        var cube = create_cube(size, [K, G, K, K, R, K]);
        cube.position.copy(new THREE.Vector3(0, 1, 2).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [K, K, K, K, R, K]);
        cube.position.copy(new THREE.Vector3(1, 1, 2).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.center_cubes.R = cube;
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [B, K, K, K, R, K]);
        cube.position.copy(new THREE.Vector3(2, 1, 2).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);

        var cube = create_cube(size, [K, G, W, K, R, K]);
        cube.position.copy(new THREE.Vector3(0, 2, 2).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [K, K, W, K, R, K]);
        cube.position.copy(new THREE.Vector3(1, 2, 2).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);
        var cube = create_cube(size, [B, K, W, K, R, K]);
        cube.position.copy(new THREE.Vector3(2, 2, 2).multiplyScalar(size).addScalar(size/2.0));
        cube_list.push(cube)
        this.rubik_mesh.add(cube);

        this.pivot_mesh.add(this.rubik_mesh);
        this.rubik_mesh.position.setScalar(-size * 1.5);

        this.list = cube_list
        this.curr_subgroup = null;

        // Assign name to center cubes
        Object.keys(this.center_cubes).forEach(key=>{
            this.center_cubes[key].name = key;
        })
        // Add light to center
        this.light1 = new THREE.Group()
        this.light1.add(new THREE.PointLight( 0xaa2222, 2, 250, 2));
        this.light1.add(new THREE.Mesh(new THREE.SphereGeometry(this.size/10,64), new THREE.MeshLambertMaterial({color:0xffffff})));
        this.pivot_mesh.add( this.light1 );

        this.light2 = new THREE.Group()
        this.light2.add(new THREE.PointLight( 0x22aa22, 2, 250, 2));
        this.light2.add(new THREE.Mesh(new THREE.SphereGeometry(this.size/10,64), new THREE.MeshLambertMaterial({color:0xffffff})));
        this.pivot_mesh.add( this.light2 );

        this.light3 = new THREE.Group()
        this.light3.add(new THREE.PointLight( 0x2222aa, 2, 250, 2));
        this.light3.add(new THREE.Mesh(new THREE.SphereGeometry(this.size/10,64), new THREE.MeshLambertMaterial({color:0xffffff})));
        this.pivot_mesh.add( this.light3 );

        let self = this;
        let tweenPos = new TWEEN.Tween({t: 0})
        .to({t: '+1'}, 1000)
        .onUpdate(function(obj){
            self.light1.position.set(Math.sin(obj.t * Math.PI/2), 0, Math.cos(obj.t * Math.PI/2));
            self.light1.position.multiplyScalar(self.size/3)

            obj.t += 1
            self.light2.position.set(Math.sin(obj.t * Math.PI/2), Math.cos(obj.t * Math.PI/2), 0);
            self.light2.position.multiplyScalar(self.size/3)

            self.light3.position.set(0, -Math.sin(obj.t * Math.PI/2), Math.cos(obj.t * Math.PI/2));
            self.light3.position.multiplyScalar(self.size/3)
        })
        .repeat(Infinity)
        .repeatDelay(1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .start();
    }

    getRubikSpacePos(in_cube){
        let pos = in_cube.position.clone()
        in_cube.parent.localToWorld(pos);
        this.pivot_mesh.worldToLocal(pos);
        return pos
    }

    removeSubgroup(){
        // Remove subgroup if it exists
        if(this.curr_subgroup != null){
            let children_list = Object.values(this.curr_subgroup.children)
            children_list.forEach(cube => {
                this.rubik_mesh.attach(cube)
            });
            this.rubik_mesh.remove(this.curr_subgroup)
            this.curr_subgroup = null;
        }
    }

    getFaceSubgroup(normal_vec){
        this.removeSubgroup();
        var found_cube = null; 
        Object.keys(this.center_cubes).every(key =>{
            let center = this.center_cubes[key];
            // Check if within one degree
            if(this.getRubikSpacePos(center).angleTo(normal_vec) < Math.PI / 180){
                found_cube = center;
                return false;
            }
            return true;
        });
        if(found_cube == null){
            return null;
        }
        var center_normal = this.getRubikSpacePos(found_cube)
        // Attempt to group by checking the angle between all mats
        var group = new THREE.Group()
        this.curr_subgroup = group;
        this.rubik_mesh.add(group);
        group.position.copy(found_cube.position)
        this.list.forEach(cube => {
            // Within 60*
            if(this.getRubikSpacePos(cube).angleTo(center_normal) < Math.PI / 180 * 60){
                group.attach(cube);
            }
        });
        if(group.children.length != 9){
            throw Error('Face not properly captured')
        }
        return group;
    }

    cleanup(){
        if(isRotating){
            throw Error('Cleanup during rotate');
        }
        this.removeSubgroup();
        // Attempt to adjust all angles and positions to snap to closest predefined values
        function angleCleanup(a){
            a = (a % (Math.PI*2) + Math.PI*2) % (Math.PI*2)
            return Math.round(a / (Math.PI/2)) * (Math.PI/2);
        }
        function posCleanup(x, size){
            return Math.round(x / (size/2)) * (size/2);
        }
        this.list.forEach(cube=>{
            cube.position.x = posCleanup(cube.position.x, this.size);
            cube.position.y = posCleanup(cube.position.y, this.size);
            cube.position.z = posCleanup(cube.position.z, this.size);
            cube.rotation.x = angleCleanup(cube.rotation.x);
            cube.rotation.y = angleCleanup(cube.rotation.y);
            cube.rotation.z = angleCleanup(cube.rotation.z);
        })
    }
}

var isRotating = false;

var tweenRotateOnAxis = function() {

    // axis is assumed to be normalized
    // angle is in radians

    var qStart = new THREE.Quaternion();
    var o = new THREE.Object3D();
    return function tweenRotateOnAxis( object, axis, angle, rot_t, end_callback) {

        if(isRotating){
            return false;
        }

        isRotating = true;
        var qEnd, time = { t: 0 };

        // start quaternion
        qStart.copy( object.quaternion );

        // end quaternion
        o.quaternion.copy( qStart );
        o.rotateOnAxis( axis, angle );
        qEnd = o.quaternion;

        // tween
        new TWEEN.Tween( time )
            .to( { t : 1 }, rot_t )
            .easing( TWEEN.Easing.Back.InOut )
            .onUpdate( function() {
                object.quaternion.slerpQuaternions( qStart, qEnd, time.t );
            } )
            .onComplete( function() {
                object.quaternion.copy( qEnd ); // to be exact
                isRotating = false;
                if(end_callback){
                    end_callback();
                }
            } )
            .start();

        return true;
    };

}();

function getCartesianClosest(dir){
    // absolute values for direction cosines, bigger value equals closer to basis axis
    let xn = Math.abs(dir.x);
    let yn = Math.abs(dir.y);
    let zn = Math.abs(dir.z);
    let v;

    if ( (xn >= yn) && (xn >= zn) ) {
        // x code
        dir.x > 0 ? v = [ 1, 0, 0 ] : v = [ -1, 0, 0 ] ;
    } else if ( (yn > xn) && (yn >= zn) ) {
        // y code
        dir.y > 0 ? v = [ 0, 1, 0 ] : v = [ 0, -1, 0 ] ;
    } else if ( (zn > xn) && (zn > yn) ) {
        // z code
        dir.z > 0 ? v = [ 0, 0, 1 ] : v = [ 0, 0, -1 ] ;
    } else {
        // oh-no we messed up code
        // has to be
        v = [ 1, 0, 0 ];
        console.log('edge case')
    }
    return new THREE.Vector3(v[0], v[1], v[2]);
}

function commenceFaceRotation(ax, reverse, time, callback){
    if(isRotating){
        return false;
    }
    let f = rubik.getFaceSubgroup(ax)
    let coeff = reverse ? -0.5 : 0.5; 
    if(f != null){
        tweenRotateOnAxis(f, ax, coeff * Math.PI, time, ()=>{
            // Enforce cleanup
            rubik.cleanup()
            if(callback){
                callback()
            }
        })
    }
    return true;
}

function getFacedRubikNormal(cam_dir){
    // Invert dir
    cam_dir.multiplyScalar(-1);
    let mat =  rubik.pivot_mesh.matrixWorld.clone();
    cam_dir.transformDirection(mat.invert() );
    return getCartesianClosest(cam_dir);
}


const rubik = new Rubik(2);
rubik.pivot_mesh.position.y = 5
scene.add(rubik.pivot_mesh)

camera.position.set(15, 8, 0);
camera.lookAt(new THREE.Vector3(0, 8, 0))

const controls = new THREE.OrbitControls( camera, renderer.domElement );

var animate = function () {
    controls.update();
    TWEEN.update()
	requestAnimationFrame( animate );
    // Get elapsed time for rotation speed calculations
    const delta = clock.getDelta()
	renderer.render(scene, camera);
};

// WINDOW RESIZE
function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

document.addEventListener('keydown', function(event) {
    if(isRotating){
        console.log('Ignored')
        return;
    }
    var cam_dir = new THREE.Vector3(); 
    camera.getWorldDirection(cam_dir);

    var cam_up = new THREE.Vector3(0, 1, 0);
    cam_up.transformDirection(camera.matrixWorld)

    time = 600

    if (event.key === ',') {
        tweenRotateOnAxis(rubik.pivot_mesh, getFacedRubikNormal(cam_dir), 0.5 * Math.PI, time)
    }
    if (event.key === '.') {
        tweenRotateOnAxis(rubik.pivot_mesh, getFacedRubikNormal(cam_dir), -0.5 * Math.PI, time)
    }
    if (event.key === 'ArrowUp') {
        tweenRotateOnAxis(rubik.pivot_mesh, getFacedRubikNormal(cam_dir.cross(cam_up)), 0.5 * Math.PI, time)
    }
    if (event.key === 'ArrowDown') {
        tweenRotateOnAxis(rubik.pivot_mesh, getFacedRubikNormal(cam_dir.cross(cam_up)), -0.5 * Math.PI, time)
    }
    if (event.key === 'ArrowRight') {
        tweenRotateOnAxis(rubik.pivot_mesh, getFacedRubikNormal(cam_up), -0.5 * Math.PI, time)
    }
    if (event.key === 'ArrowLeft') {
        tweenRotateOnAxis(rubik.pivot_mesh, getFacedRubikNormal(cam_up), 0.5 * Math.PI, time)
    }

    if (event.key === 'f') {
        commenceFaceRotation(getFacedRubikNormal(cam_dir), true, time)
    }
    if (event.key === 'r') {
        commenceFaceRotation(getFacedRubikNormal(cam_dir.cross(cam_up).multiplyScalar(-1)), true, time)
    }
    if (event.key === 'u') {
        commenceFaceRotation(getFacedRubikNormal(cam_up.multiplyScalar(-1)), true, time)    
    }
    if (event.key === 'l') {
        commenceFaceRotation(getFacedRubikNormal(cam_dir.cross(cam_up)), true, time)    
    }
    if (event.key === 'b') {
        commenceFaceRotation(getFacedRubikNormal(cam_dir.multiplyScalar(-1)), true, time)
    }
    if (event.key === 'd') {
        commenceFaceRotation(getFacedRubikNormal(cam_up), true, time)    
    }

    if (event.key === 'F') {
        commenceFaceRotation(getFacedRubikNormal(cam_dir), false, time)
    }
    if (event.key === 'R') {
        commenceFaceRotation(getFacedRubikNormal(cam_dir.cross(cam_up).multiplyScalar(-1)), false, time)
    }
    if (event.key === 'U') {
        commenceFaceRotation(getFacedRubikNormal(cam_up.multiplyScalar(-1)), false, time)    
    }
    if (event.key === 'L') {
        commenceFaceRotation(getFacedRubikNormal(cam_dir.cross(cam_up)), false, time)    
    }
    if (event.key === 'B') {
        commenceFaceRotation(getFacedRubikNormal(cam_dir.multiplyScalar(-1)), false, time)
    }
    if (event.key === 'D') {
        commenceFaceRotation(getFacedRubikNormal(cam_up), false, time)    
    }

    if (event.key === ' ') {
        shuffle(20, 150, ()=>{
            console.log('Done');
        })
    }
});

function shuffle(iters, time, callback){
    if(isRotating){
        return false;
    }
    // Get random face and random rotate left or right
    let face_idx = Math.floor(Math.random() * 6);
    let sign = (face_idx%2 * 2) - 1;
    let normal;
    if(face_idx < 2){
        normal = new THREE.Vector3(sign, 0, 0);
    }else if(face_idx < 4){
        normal = new THREE.Vector3(0, sign, 0);
    }else{
        normal = new THREE.Vector3(0, 0, sign);
    }

    // Get random rotation
    let rev = (Math.floor(Math.random() * 2) == 1);
    return commenceFaceRotation(normal, rev, time, ()=>{
        if(iters == 0){
            callback();
            return;
        }
        shuffle(iters-1, time, callback);
    });
}

function debug(){

}

setInterval(debug, 2000);

window.onload = function () {
    document.getElementById('start-button').onclick = function(){
        let startScreen = document.getElementById('start-screen')
        startScreen.parentNode.removeChild(startScreen);
        init();
    }
};

// init();
