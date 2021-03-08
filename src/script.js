import './style.css'
import * as THREE from 'three'
// import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as CANNON from 'cannon-es'

/**
 * Debug
 */
const parameters = {
    color1: '#02c39a',
    color2: '#f0f3bd',
    color3: '#00a896',
    color4: '#028090'
}
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const marbleTexture = textureLoader.load('/textures/more-leaves.png')
const matcapTexture2 = textureLoader.load('/textures/sandyMatcap.png')
const matcapTexture1 = textureLoader.load('/textures/cyanMatcap.png')
const characterDTexture = textureLoader.load('/textures/letter_d.png')
const particleTexture = textureLoader.load('/textures/particles/1.png')
const treetopTexture = textureLoader.load('/textures/7.png')
const fontTexture = textureLoader.load('/textures/oliveMatcap.png')

// Physics
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.gravity.set(0, -9.82, 0)

// materials
const concreteMaterial = new CANNON.Material('concrete')
const plasticMaterial = new CANNON.Material('plastic')

const concretePlasticMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: 0.1,
        restitution: 0.3
    }
)

world.addContactMaterial(concretePlasticMaterial)
world.defaultContactMaterial = concretePlasticMaterial

//  Lettering
let lettersToUpdate = ['L','L','I','A','M','M','C','B','E','A','N']
let titleToUpdate = ['C','R','E','A','T','I','V','E','D','E','V','E','L','O','P','E','R']
lettersToUpdate = lettersToUpdate.reverse()
titleToUpdate = titleToUpdate.reverse()
let letterOffset = 2.2
let titleOffset = 0
const quaterionAxisY = new CANNON.Vec3(0,1,0);
const quaternionRotation = -Math.PI / 2;

const fontLoader = new THREE.FontLoader()
fontLoader.load(
    '/fonts/High Jersey_Regular.json',
    (font) =>
    {
        for(let i = 0; i < titleToUpdate.length; i++) {
            const textGeometry = new THREE.TextBufferGeometry(
                titleToUpdate[i],
                {
                    font,
                    size: 0.8,
                    height: 0.3,
                    curveSegments: 30,
                    bevelEnabled: true,
                    bevelThickness: 0.3,
                    bevelSize: 0.07,
                    bevelOffset: 0,
                    bevelSegments: 30
                }
            )
            textGeometry.rotateY = Math.PI / 4
            textGeometry.center()
            
            const textMaterial = new THREE.MeshMatcapMaterial()
            const text = new THREE.Mesh(textGeometry, textMaterial)
            text.rotateY = Math.PI/4
            text.position.y = 3
            scene.add(text)
            textMaterial.matcap = fontTexture

            const textBox = new CANNON.Box(new CANNON.Vec3(0.3,0.4,0.3))
            const textBody = new CANNON.Body({
                mass: 0.3,
                shape: textBox,
                material: concretePlasticMaterial
            })
            textBody.quaternion.setFromAxisAngle(quaterionAxisY, quaternionRotation)
            textBody.position.copy({x: text.position.x  - 20, y: text.position.y - 0.9, z: text.position.z - titleOffset})
            world.addBody(textBody)

            titleOffset += 0.62

            objectsToUpdate.push({
                mesh: text,
                body: textBody
            })
        }
    }
)
fontLoader.load(
    '/fonts/High Jersey_Regular.json',
    (font) =>
    {
        for(let i = 0; i < lettersToUpdate.length; i++) {
            const textGeometry = new THREE.TextBufferGeometry(
                lettersToUpdate[i],
                {
                    font,
                    size: 0.8,
                    height: 0.3,
                    curveSegments: 30,
                    bevelEnabled: true,
                    bevelThickness: 0.3,
                    bevelSize: 0.07,
                    bevelOffset: 0,
                    bevelSegments: 30
                }
            )
            textGeometry.rotateY = Math.PI / 4
            textGeometry.center()
            
            const textMaterial = new THREE.MeshMatcapMaterial()
            const text = new THREE.Mesh(textGeometry, textMaterial)
            text.rotateY = Math.PI/4
            text.position.y = 3
            scene.add(text)
            textMaterial.matcap = fontTexture

            const textBox = new CANNON.Box(new CANNON.Vec3(0.3,0.5,0.3))
            const textBody = new CANNON.Body({
                mass: 0.3,
                shape: textBox,
                material: concretePlasticMaterial
            })
            textBody.quaternion.setFromAxisAngle(quaterionAxisY, quaternionRotation)
            textBody.position.copy({x: text.position.x  - 20, y: text.position.y + 0.5, z: text.position.z - letterOffset})
            world.addBody(textBody)

            letterOffset += 0.62

            objectsToUpdate.push({
                mesh: text,
                body: textBody
            })
        }
    }
)
let testingLetters = []
fontLoader.load(
    '/fonts/High Jersey_Regular.json',
    (font) =>
    {
        const textGeometry = new THREE.TextBufferGeometry(
            "Press Enter",
            {
                font,
                size: 0.8,
                height: 0.3,
                curveSegments: 30,
                bevelEnabled: true,
                bevelThickness: 0.3,
                bevelSize: 0.07,
                bevelOffset: 0,
                bevelSegments: 30
            }
        )
        textGeometry.center()
        textGeometry.rotateY = Math.PI / 4
        
        const textMaterial = new THREE.MeshMatcapMaterial()
        const text = new THREE.Mesh(textGeometry, textMaterial)
        text.position.y = -3
        text.position.x = -20
        text.position.z = 6
        text.quaternion.setFromAxisAngle(quaterionAxisY, quaternionRotation)
        scene.add(text)
        textMaterial.matcap = fontTexture
        testingLetters.push({text})
    }
)

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// SPACE
const particleGeometry = new THREE.BufferGeometry()
const particleGeometry3 = new THREE.BufferGeometry()

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.5,
    sizeAttenuation: true,
    color: '#1dcdfe',
    transparent: true,
    alphaMap: particleTexture,
})
const particlesMaterial3 = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: true,
    color: '#34f5c5',
    transparent: true,
    alphaMap: particleTexture,
})

const count = 9000
const radius = 60

const positions = new Float32Array(count * 3)
const positions3 = new Float32Array(count * 3)

for(let i = 0; i < (count); i++) {
    let randomS = Math.random() * 2 * Math.PI
    let randomT = Math.random() * Math.PI
    for(let j = 0; j < 3; j++) {
        if(j === 0) {
            positions[(3*i + j)] = radius * Math.sin(randomS) * Math.cos(randomT)
        }
        if(j === 1) {
            positions[(3*i + j)] = radius * Math.sin(randomS) * Math.sin(randomT)
        }
        if(j === 2) {
            positions[(3*i + j)] = radius * Math.cos(randomS)
        }
    }
}
for(let i = 0; i < (count); i++) {
    let randomS = Math.random() * 2 * Math.PI
    let randomT = Math.random() * Math.PI
    for(let j = 0; j < 3; j++) {
        if(j === 0) {
            positions3[(3*i + j)] = radius * 0.5 * Math.sin(randomS) * Math.cos(randomT)
        }
        if(j === 1) {
            positions3[(3*i + j)] = radius * 0.5 * Math.sin(randomS) * Math.sin(randomT)
        }
        if(j === 2) {
            positions3[(3*i + j)] = radius * 0.5 * Math.cos(randomS)
        }
    }
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particleGeometry3.setAttribute('position', new THREE.BufferAttribute(positions3, 3))
const particles = new THREE.Points(particleGeometry, particlesMaterial)
const particles3 = new THREE.Points(particleGeometry3, particlesMaterial3)
scene.add(particles3)
scene.add(particles)

let objectsToUpdate = []
let boxesToUpdate = []
const sphereGeometry = new THREE.SphereBufferGeometry(1, 28, 28, 0, Math.PI * 2, 0, Math.PI)
const sphereMaterial = new THREE.MeshStandardMaterial({
    map: marbleTexture,
    overdraw: true
})

// KEYBOARD
const createKeyboard = (positionX, positionY, positionZ, sizeX, sizeY, sizeZ) => {
    const keyGeometry = new THREE.BoxGeometry(sizeX,sizeY,sizeZ)
    const keyMaterial = new THREE.MeshBasicMaterial({
        color: '#fff',
        map: characterDTexture,
    })
    const keyMesh = new THREE.Mesh(
        keyGeometry,
        keyMaterial
    )
    keyMesh.position.x = positionX
    keyMesh.position.y = positionY
    keyMesh.position.z = positionZ

    scene.add(keyMesh)
}
// Floor
const mainFloorMaterial = new THREE.MeshBasicMaterial({
    color: parameters.color2,
})
const iceFloorMaterial = new THREE.MeshBasicMaterial({
    color: '#d7fffe'
})
const darkIceFloorMaterial = new THREE.MeshBasicMaterial({
    color: '#7ec0e3'
})

const floorBuilder = (floorWidth, floorPositionX, floorPositionY, floorPositionZ, floorMaterial) => {
    const floorShape = new CANNON.Cylinder(floorWidth,floorWidth, 0.1, 60)
    const floorBody = new CANNON.Body()
    floorBody.mass = 0
    floorBody.friction = 1,
    floorBody.restitution = 0.3
    floorBody.position.x = floorPositionX
    floorBody.position.y = floorPositionY
    floorBody.position.z = floorPositionZ
    floorBody.addShape(floorShape)
    world.addBody(floorBody)

    const floor = new THREE.Mesh(
        new THREE.CylinderGeometry(floorWidth, floorWidth, 0.1, 60),
        floorMaterial
    )
    floor.position.x = floorPositionX
    floor.position.y = floorPositionY
    floor.position.z = floorPositionZ
    scene.add(floor)
}

// BALL
// THREE mesh
const mesh = new THREE.Mesh(
    sphereGeometry,
    sphereMaterial
)
mesh.scale.set(1,1,1)
scene.add(mesh)

// Cannon
const shape = new CANNON.Sphere(1)
const body = new CANNON.Body({
    mass: 1.2,
    shape,
    material: concretePlasticMaterial
})
body.position.copy({x: -26, y: 3, z: 0})
world.addBody(body)

objectsToUpdate.push({
    mesh: mesh,
    body: body
})

const icyCubeMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture1,
    transparent: true,
    opacity: 0.8
})
const bodyMatcapMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture2
})

// SQUARE GENERATOR
const boxBuilder = (sizex, sizey, sizez, positionX, positionY, positionZ, mass, bodyMaterial) => {
    const mesher = new THREE.Mesh(
        new THREE.BoxGeometry(sizex,sizey,sizez),
        bodyMaterial
    )
    mesher.castShadow = true
    mesher.position.copy({x: positionX, y: positionY, z: positionZ})
    scene.add(mesher)

    const shaper = new CANNON.Box(new CANNON.Vec3(sizex/2,sizey/2,sizez/2))
    const bodyer = new CANNON.Body({
        mass: mass,
        shape: shaper,
        material: concretePlasticMaterial
    })
    bodyer.position.copy({x: positionX, y: positionY, z: positionZ})
    world.addBody(bodyer)

    boxesToUpdate.push({
        mesh: mesher,
        body: bodyer
    })
}

// TREE GENERATOR
const treeBuilder = (positionX,positionY,positionZ, width, height) => {
    const treeGeometry = new THREE.CylinderGeometry(0.001,width,height,5)
    const treeMaterial = new THREE.MeshMatcapMaterial({matcap: treetopTexture})
    const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial)
    treeMesh.position.copy({x: positionX, y: positionY + 0.1 + height * 0.5, z: positionZ})
    scene.add(treeMesh)

    const trunkGeometry = new THREE.BoxGeometry(height * 0.5 * 0.5,height * 0.5 * 0.5,height * 0.5 * 0.5)
    const trunkMaterial = new THREE.MeshToonMaterial({color: '#5c4322'})
    const trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial)
    trunkMesh.position.x = positionX
    trunkMesh.position.y = positionY - (height * 0.25 * 0.5)
    trunkMesh.position.z = positionZ
    scene.add(trunkMesh)

    const treeShape = new CANNON.Cylinder(0.001,width,height,5)
    const treeBody = new CANNON.Body({
        mass: 0.6,
        material: concretePlasticMaterial
    })
    treeBody.position.copy({x: positionX, y: positionY + 0.1 + height * 0.5, z: positionZ})
    treeBody.addShape(treeShape)
    world.addBody(treeBody)

    const trunkShape = new CANNON.Box(new CANNON.Vec3(height * 0.5 * 0.5 * 0.5,height * 0.5 * 0.5 * 0.5,height * 0.5 * 0.5 * 0.5))
    const trunkBody = new CANNON.Body({
        mass: 0.3,
        material: concretePlasticMaterial
    })
    trunkBody.position.x = positionX
    trunkBody.position.y = positionY - (height * 0.25 * 0.5)
    trunkBody.position.z = positionZ
    trunkBody.addShape(trunkShape)
    world.addBody(trunkBody)

    objectsToUpdate.push({
        mesh: treeMesh,
        body: treeBody
    })
    objectsToUpdate.push({
        mesh: trunkMesh,
        body: trunkBody
    })

}

// CONTROLS
let angle = -Math.PI / 2
let forwardForce = false
let backwardForce = false
let movementLeft = false
let movementRight = false

window.addEventListener('keydown', (event) => {
    if(event.key == 'ArrowUp' || event.key == 'w') {
        forwardForce = true
    }
    if(event.key === 'ArrowDown' || event.key == 's') {
        backwardForce = true
    }
    if(event.key === 'ArrowLeft' || event.key == 'a') {
        movementLeft = true
    }
    if(event.key === 'ArrowRight' || event.key == 'd') {
        movementRight = true
    }
    if(event.keyCode === 32 && body.velocity.y < 0.3 && body.velocity.y > -0.3) {
        body.force.y = 500
    }
})

window.addEventListener('keyup', (event) => {
    if(event.key === 'ArrowUp' || event.key == 'w') {
        forwardForce = false
    }
    if(event.key === 'ArrowDown' || event.key == 's') {
        backwardForce = false
    }
    if(event.key === 'ArrowLeft' || event.key == 'a') {
        movementLeft = false
    }
    if(event.key === 'ArrowRight' || event.key == 'd') {
        movementRight = false
    }
})

// MOBILE CONTROLS
document.querySelector('.keyboard-up').addEventListener('touchstart', () => {
    forwardForce = true
    document.querySelector('.keyboard-up').style.background = 'white'
})
document.querySelector('.keyboard-up').addEventListener('touchend', () => {
    forwardForce = false
    document.querySelector('.keyboard-up').style.background = 'none'
})
document.querySelector('.keyboard-down').addEventListener('touchstart', () => {
    backwardForce = true
    document.querySelector('.keyboard-down').style.background = 'white'
})
document.querySelector('.keyboard-down').addEventListener('touchend', () => {
    backwardForce = false
    document.querySelector('.keyboard-down').style.background = 'none'
})
document.querySelector('.keyboard-left').addEventListener('touchstart', () => {
    movementLeft = true
    document.querySelector('.keyboard-left').style.background = 'white'
})
document.querySelector('.keyboard-left').addEventListener('touchend', () => {
    movementLeft = false
    document.querySelector('.keyboard-left').style.background = 'none'
})
document.querySelector('.keyboard-right').addEventListener('touchstart', () => {
    movementRight = true
    document.querySelector('.keyboard-right').style.background = 'white'
})
document.querySelector('.keyboard-right').addEventListener('touchend', () => {
    movementRight = false
    document.querySelector('.keyboard-right').style.background = 'none'
})
document.querySelector('.inner-circle').addEventListener('touchstart', () => {
    document.querySelector('.inner-circle').style.background = 'white'
    document.querySelector('.inner-circle').style.height = '85px'
    document.querySelector('.inner-circle').style.width = '85px'

    if(body.velocity.y < 0.3 && body.velocity.y > -0.3) {
        body.force.y = 500
    }
})
document.querySelector('.inner-circle').addEventListener('touchend', () => {
    document.querySelector('.inner-circle').style.background = 'none'
    document.querySelector('.inner-circle').style.height = '75px'
    document.querySelector('.inner-circle').style.width = '75px'
})

// EXTRA LIGHT AND CAMERA SETTINGS
camera.position.set(body.position.x + 5, body.position.y + 5, body.position.z + 5)
camera.rotation.y = Math.PI / 4
camera.lookAt(mesh.position)

// GUI


// Animate

const clock = new THREE.Clock()
const cameraDirectionVector = new THREE.Vector3()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime() 
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // MODELS

    // Update Physics World
    for(let i = 0; i < objectsToUpdate.length; i++) {
        objectsToUpdate[i].mesh.position.copy(objectsToUpdate[i].body.position)
    
        objectsToUpdate[i].mesh.quaternion.copy(objectsToUpdate[i].body.quaternion)
    }
    for(let i = 0; i < boxesToUpdate.length; i++) {
        boxesToUpdate[i].mesh.position.copy(boxesToUpdate[i].body.position)
    
        boxesToUpdate[i].mesh.quaternion.copy(boxesToUpdate[i].body.quaternion)

        boxesToUpdate[i].body.force.y = 2.85
    }
    world.step(1/60,deltaTime,3)

    // CONTROLS
    camera.getWorldDirection(cameraDirectionVector)

    if(forwardForce) {
        body.force.x = cameraDirectionVector.x * 25
        body.force.z = cameraDirectionVector.z * 25
    }
    if(movementLeft) {
        angle += 0.05
    }
    if(movementRight) {
        angle -= 0.05
    }
    if(backwardForce) {
        body.force.x = -cameraDirectionVector.x * 25
        body.force.z = -cameraDirectionVector.z * 25
    }

    camera.position.set(body.position.x + Math.sin(angle) * 10, body.position.y + 7, body.position.z + Math.cos(angle) * 10)
    camera.lookAt(mesh.position)

    // SPACE ROTATION
    const speedBuffer = 0.03

    particles.rotation.x = Math.cos(body.position.x * speedBuffer)
    particles.rotation.y = Math.sin(body.position.z * speedBuffer)

    particles3.rotation.x = Math.sin(body.position.x * speedBuffer)
    particles3.rotation.y = Math.cos(body.position.z * speedBuffer)

    // NOT WEBGL STUFF
    if (body.position.x > -22.5 && body.position.x < -17.5 && body.position.z < 8.5 && body.position.z > 3.5) {
        testingLetters[0].text.position.y += 0.1
        if(testingLetters[0].text.position.y > 3) {
            testingLetters[0].text.position.y = 3
        }
    } 

    // LETTERING 
    window.addEventListener('keypress', (event) => {
        if (event.key == 'Enter' && body.position.x > -22.5 && body.position.x < -17.5 && body.position.z < 8.5 && body.position.z > 3.5) {
            document.querySelector('.bitcoin-csv-parser').style.display = 'block'
        }
    })

    // Render
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

// ENVIRONMENT FUNCTIONS
treeBuilder(19.5, 5.1, 11.6, 2,4)
treeBuilder(19.9, 5.1, -15.4, 1.2,2.4)
treeBuilder(18, 5.1, -16.6, 1,2)
treeBuilder(18, 1, -3.6, 3,6)
treeBuilder(13, 1, -5, 2,4)
treeBuilder(19, 1, 2, 2,4)

for(let k = 0; k < 2; k++) {
    for(let j = 0; j < 2; j++) {
        for(let i = 0; i < 2; i++) {
            boxBuilder(1,1,1,-5 - (k -5),1+(i + 0.01),(j + 23), 0.3, icyCubeMaterial)
        }
    }
}
for(let k = 0; k < 2; k++) {
    for(let j = 0; j < 2; j++) {
        for(let i = 0; i < 2; i++) {
            boxBuilder(1,1,1,-5 - (k - 7.5),1+(i + 0.01),(j + 23), 0.3, icyCubeMaterial)
        }
    }
}
for(let k = 0; k < 2; k++) {
    for(let j = 0; j < 2; j++) {
        for(let i = 0; i < 2; i++) {
            boxBuilder(1,1,1,-5 - (k - 6),1+(i + 3),(j + 23), 0.3, icyCubeMaterial)
        }
    }
}
// STAIRS
boxBuilder(2,0.2,6,10,1,10,0, bodyMatcapMaterial)
boxBuilder(2,0.2,6,12,2,10,0, bodyMatcapMaterial)
boxBuilder(2,0.2,6,14,3,10,0, bodyMatcapMaterial)
boxBuilder(6,0.2,6,18,4,10,0, bodyMatcapMaterial)
boxBuilder(6,0.2,2,18,5,6,0, bodyMatcapMaterial)
boxBuilder(6,0.2,2,18,6,4,0, bodyMatcapMaterial)
boxBuilder(6,0.2,2,18,7,2,0, bodyMatcapMaterial)
boxBuilder(6,0.2,6,18,8,-2,0, bodyMatcapMaterial)
boxBuilder(2,0.2,6,14,7,-2,0, bodyMatcapMaterial)
boxBuilder(2,0.2,6,12,6,-2,0, bodyMatcapMaterial)
boxBuilder(2,0.2,6,10,5,-2,0, bodyMatcapMaterial)
boxBuilder(6,0.2,6,6,4,-2,0, bodyMatcapMaterial)
boxBuilder(6,0.2,2,6,3,2,0, bodyMatcapMaterial)
boxBuilder(6,0.2,2,6,2,4,0, bodyMatcapMaterial)
boxBuilder(6,0.2,2,6,1,6,0, bodyMatcapMaterial)
boxBuilder(6,0.2,6,18,4,-14,0, bodyMatcapMaterial)
boxBuilder(6,0.2,2,18,5,-10,0, bodyMatcapMaterial)
boxBuilder(6,0.2,2,18,6,-8,0, bodyMatcapMaterial)
boxBuilder(6,0.2,2,18,7,-6,0, bodyMatcapMaterial)
boxBuilder(2,0.2,6,14,3,-14,0, bodyMatcapMaterial)
boxBuilder(2,0.2,6,12,2,-14,0, bodyMatcapMaterial)
boxBuilder(2,0.2,6,10,1,-14,0, bodyMatcapMaterial)
boxBuilder(6,0.2,2,6,3,-6,0, bodyMatcapMaterial)
boxBuilder(6,0.2,2,6,2,-8,0, bodyMatcapMaterial)
boxBuilder(6,0.2,2,6,1,-10,0, bodyMatcapMaterial)
// PROJECT FLOOR
boxBuilder(5,0.2,5,-20,0.25,6,0, bodyMatcapMaterial)
// FLOOR
floorBuilder(30,0,0.01,0,mainFloorMaterial)
floorBuilder(8,0,0.02,20,iceFloorMaterial)
floorBuilder(3,-2,0.03,19,darkIceFloorMaterial)

// KEYBOARD
// createKeyboard(-25,1,6,1,0.3,1)
// createKeyboard(-23.5,1,6,1,0.3,1)
// createKeyboard(-25,1,7.5,1,0.3,1)
// createKeyboard(-25,1,4.5,1,0.3,1)
// createKeyboard(-27,1,6,1,0.3,6)

// NOT WEBGL STUFF
document.querySelector('.exit-outer').addEventListener('click', () => {
    document.querySelector('.bitcoin-csv-parser').style.display = 'none'
})
