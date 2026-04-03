import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDBackground = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;

        // Scene setup
        const scene = new THREE.Scene();
        // Fog for depth
        scene.fog = new THREE.FogExp2(0x1a1a2e, 0.002);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        currentMount.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00d2ff, 2, 100);
        pointLight.position.set(10, 10, 10);
        pointLight.castShadow = true;
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0xff00ff, 2, 100);
        pointLight2.position.set(-10, -10, 10);
        scene.add(pointLight2);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 10, 5);
        scene.add(directionalLight);

        // Objects group to rotate independently or together
        const objectsGroup = new THREE.Group();
        scene.add(objectsGroup);

        // Materials
        const materialCube = new THREE.MeshStandardMaterial({ 
            color: 0x1e293b, 
            roughness: 0.2, 
            metalness: 0.8 
        });
        
        const materialSphere = new THREE.MeshStandardMaterial({ 
            color: 0x00d2ff, 
            roughness: 0.4, 
            metalness: 0.5,
            wireframe: false
        });

        const materialTorus = new THREE.MeshStandardMaterial({ 
            color: 0x6366f1, 
            roughness: 0.3, 
            metalness: 0.6 
        });

        const materialIcosa = new THREE.MeshStandardMaterial({
            color: 0xff00ff,
            roughness: 0.1,
            metalness: 0.9,
            wireframe: true
        });

        // Shapes
        // 1. Large Cube
        const geometryCube = new THREE.BoxGeometry(4, 4, 4);
        const cube = new THREE.Mesh(geometryCube, materialCube);
        cube.position.set(6, 2, -5);
        cube.rotation.set(Math.PI / 4, Math.PI / 4, 0);
        objectsGroup.add(cube);

        // 2. Sphere
        const geometrySphere = new THREE.SphereGeometry(2, 32, 32);
        const sphere = new THREE.Mesh(geometrySphere, materialSphere);
        sphere.position.set(-5, 4, -8);
        objectsGroup.add(sphere);

        // 3. Torus (Donut)
        const geometryTorus = new THREE.TorusGeometry(2.5, 0.8, 16, 100);
        const torus = new THREE.Mesh(geometryTorus, materialTorus);
        torus.position.set(8, -4, -10);
        torus.rotation.set(Math.PI / 2, 0, 0);
        objectsGroup.add(torus);

        // 4. Floating Icosahedron
        const geometryIcosa = new THREE.IcosahedronGeometry(1.5);
        const icosa = new THREE.Mesh(geometryIcosa, materialIcosa);
        icosa.position.set(-7, -3, -4);
        objectsGroup.add(icosa);

        // 5. Small particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 700;
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 40; // Spread within 40 units
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 15;

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate entire group slowly
            objectsGroup.rotation.y += 0.002;

            // Rotate individual objects
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.005;

            sphere.rotation.y += 0.01;
            
            torus.rotation.x -= 0.01;
            torus.rotation.y -= 0.005;

            icosa.rotation.x += 0.01;
            icosa.rotation.z += 0.01;

            // Gentle floating movement (sine wave)
            const time = Date.now() * 0.001;
            
            cube.position.y = 2 + Math.sin(time) * 0.5;
            sphere.position.y = 4 + Math.cos(time * 0.8) * 0.5;
            torus.position.y = -4 + Math.sin(time * 1.2) * 0.5;
            icosa.position.y = -3 + Math.cos(time * 1.1) * 0.5;

            particlesMesh.rotation.y = -time * 0.05;

            // Parallax mouse effect (optional, keep simple for now)
            
            renderer.render(scene, camera);
        };

        animate();

        // Handle Resize
        const handleResize = () => {
            if (!mountRef.current) return;
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
            geometryCube.dispose();
            materialCube.dispose();
            geometrySphere.dispose();
            materialSphere.dispose();
            // ... dispose others
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0, // Behind content
        background: 'radial-gradient(circle at 30% 50%, #2e1065 0%, #0f172a 60%, #000000 100%)', // Deep purple to dark slate
        overflow: 'hidden'
    }} />;
};

export default ThreeDBackground;
