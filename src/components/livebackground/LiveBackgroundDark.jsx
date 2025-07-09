'use client';

import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useRef, useEffect } from 'react';

export default function CoolSoothingAuroraBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ dpr: 2 });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0.01, 0.01, 0.03, 1); // rich dark navy

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

    float pattern(vec2 uv, float time) {
      float lines = sin(uv.y * 10.0 + time) + 
                    cos(uv.x * 15.0 - time * 0.5) +
                    sin((uv.x + uv.y) * 8.0 - time * 0.2);
      return lines / 3.0;
    }

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      float t = uTime * 1.0;

      float wave = pattern(uv * 1.5, t);
      wave = smoothstep(0.3, 1.0, wave);

      vec3 color1 = vec3(0.0, 0.8, 0.9);
      vec3 color2 = vec3(0.4, 0.3, 0.7);
      vec3 color3 = vec3(0.1, 0.7, 0.5);

      float shift = 0.5 + 0.5 * sin(t * 0.3);
      vec3 baseColor = mix(color1, color2, shift);
      vec3 finalColor = mix(baseColor, color3, sin(uv.x * 2.0 + t) * 0.5 + 0.5);

      fragColor = vec4(finalColor * wave, 1.0);
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

    let frame;
    const animate = (t) => {
      frame = requestAnimationFrame(animate);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    };
    animate(0);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      container.removeChild(gl.canvas);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
