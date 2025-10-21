import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-game',
  template: `
    <div
      #rendererContainer
      style="width:100vw; height:100vh; position:relative;"
    >
      <div
        id="joystick"
        style="position:absolute; bottom:20px; left:20px; width:100px; height:100px; background:rgba(0,0,0,0.5); border-radius:50%;"
      ></div>
    </div>
  `,
})
export class GameComponent implements AfterViewInit {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  boy!: THREE.Mesh;
  npc!: THREE.Mesh;
  joystickData = { x: 0, y: 0 };
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  ngAfterViewInit() {
    this.init();
    this.animate();
    this.initJoystick();
    this.initInteraction();
  }

  init() {
    this.scene = new THREE.Scene();
    const width = this.rendererContainer.nativeElement.offsetWidth;
    const height = this.rendererContainer.nativeElement.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 15, 25);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Lighting
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(10, 20, 0);
    this.scene.add(dirLight);

    // Create castle and add to scene
    const castle = this.createCastle();
    this.scene.add(castle);

    // Boy placeholder (blue box)
    const boyGeo = new THREE.BoxGeometry(1, 2, 1);
    const boyMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    this.boy = new THREE.Mesh(boyGeo, boyMat);
    this.boy.position.set(0, 1, -8);
    this.scene.add(this.boy);

    // NPC placeholder (red sphere)
    const npcGeo = new THREE.SphereGeometry(1, 16, 16);
    const npcMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    this.npc = new THREE.Mesh(npcGeo, npcMat);
    this.npc.position.set(5, 1, 5);
    this.scene.add(this.npc);
  }

  createCastle(): THREE.Group {
    const castle = new THREE.Group();
    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({ color: 0x808080 })
    );
    floor.rotation.x = -Math.PI / 2;
    castle.add(floor);

    // Wall settings
    const wallHeight = 5,
      wallThickness = 1,
      castleSize = 30,
      doorWidth = 5,
      halfSize = castleSize / 2;
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

    // North wall (with door gap)
    const northGroup = new THREE.Group();
    const nwSegmentWidth = (castleSize - doorWidth) / 2;
    const leftNorth = new THREE.Mesh(
      new THREE.BoxGeometry(nwSegmentWidth, wallHeight, wallThickness),
      wallMat
    );
    leftNorth.position.set(
      -(doorWidth / 2 + nwSegmentWidth / 2),
      wallHeight / 2,
      halfSize
    );
    const rightNorth = new THREE.Mesh(
      new THREE.BoxGeometry(nwSegmentWidth, wallHeight, wallThickness),
      wallMat
    );
    rightNorth.position.set(
      doorWidth / 2 + nwSegmentWidth / 2,
      wallHeight / 2,
      halfSize
    );
    northGroup.add(leftNorth, rightNorth);
    castle.add(northGroup);

    // South wall (entrance with door gap)
    const southGroup = new THREE.Group();
    const swSegmentWidth = (castleSize - doorWidth) / 2;
    const leftSouth = new THREE.Mesh(
      new THREE.BoxGeometry(swSegmentWidth, wallHeight, wallThickness),
      wallMat
    );
    leftSouth.position.set(
      -(doorWidth / 2 + swSegmentWidth / 2),
      wallHeight / 2,
      -halfSize
    );
    const rightSouth = new THREE.Mesh(
      new THREE.BoxGeometry(swSegmentWidth, wallHeight, wallThickness),
      wallMat
    );
    rightSouth.position.set(
      doorWidth / 2 + swSegmentWidth / 2,
      wallHeight / 2,
      -halfSize
    );
    southGroup.add(leftSouth, rightSouth);
    castle.add(southGroup);

    // East and West walls (full walls)
    const eastWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, castleSize),
      wallMat
    );
    eastWall.position.set(halfSize, wallHeight / 2, 0);
    const westWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, castleSize),
      wallMat
    );
    westWall.position.set(-halfSize, wallHeight / 2, 0);
    castle.add(eastWall, westWall);

    // Towers at corners
    const towerGeo = new THREE.CylinderGeometry(2, 2, 8, 16);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    [
      [halfSize, 4, halfSize],
      [halfSize, 4, -halfSize],
      [-halfSize, 4, halfSize],
      [-halfSize, 4, -halfSize],
    ].forEach((pos) => {
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.set(pos[0], pos[1], pos[2]);
      castle.add(tower);
    });

    return castle;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    // Move boy with joystick input
    this.boy.position.x += this.joystickData.x * 0.1;
    this.boy.position.z += this.joystickData.y * 0.1;
    this.renderer.render(this.scene, this.camera);
  }

  initJoystick() {
    const joystick = document.getElementById('joystick');
    let startX = 0,
      startY = 0;
    joystick?.addEventListener('pointerdown', (e: PointerEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      joystick.setPointerCapture(e.pointerId);
    });
    joystick?.addEventListener('pointermove', (e: PointerEvent) => {
      if (e.pressure > 0) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        this.joystickData.x = Math.max(-1, Math.min(1, deltaX / 50));
        this.joystickData.y = Math.max(-1, Math.min(1, deltaY / 50));
      }
    });
    joystick?.addEventListener('pointerup', () => {
      this.joystickData = { x: 0, y: 0 };
    });
  }

  initInteraction() {
    this.renderer.domElement.addEventListener(
      'pointerdown',
      (e: PointerEvent) => {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([this.npc]);
        if (intersects.length > 0) {
          alert('Decision prompt: Choose your action!');
        }
      }
    );
  }
}
