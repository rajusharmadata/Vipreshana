'use client';

import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useRef, useEffect } from 'react';

export default function LiveBackgroundLight() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    //using and implementeing webGL
    const renderer = new Renderer({ dpr: 2 });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0.0, 0.0, 0.05, 1); 

    const geometry = new Triangle(gl);
    geometry.addAttribute('uv', {
      size: 2,
      data: new Float32Array([0, 0, 2, 0, 0, 2]),
    });

    const vertexShader = `#version 300 es
    in vec2 uv;
    in vec2 position;
    out vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0, 1);
    }`;

    const fragmentShader = `#version 300 es
    precision highp float;
    uniform float uTime;
    in vec2 vUv;
    out vec4 fragColor;

    //Wavy distortion
    void main() {
      vec2 uv = vUv;

      // continuous wavy pattern
      float waveX = sin((uv.y + uTime * 0.2) * 10.0) * 0.02;
      float waveY = cos((uv.x + uTime * 0.25) * 10.0) * 0.02;
      uv.x += waveX;
      uv.y += waveY;

      // Purple-white gradient for light mode
      vec3 purple = vec3(0.5, 0.2, 1.0);
      vec3 white = vec3(1.0);
      float mixVal = 0.5 + 0.5 * sin((uv.x + uv.y + uTime) * 3.0);
      vec3 color = mix(purple, white, mixVal);

      // center focus
      float dist = distance(uv, vec2(0.5));
      float fade = smoothstep(0.8, 0.3, dist);
      color *= fade;

      fragColor = vec4(color, 1.0);
    }`;

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => renderer.setSize(container.offsetWidth, container.offsetHeight);
    window.addEventListener('resize', resize);
    resize();

    //looping
    let frame;
    const animate = (t) => {
      frame = requestAnimationFrame(animate);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    };
    animate(0);

    //cleanup function
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      container.removeChild(gl.canvas);
    };
  }, []);

  //rendering the background
  return <div ref={containerRef} className="w-full h-full" />;
}