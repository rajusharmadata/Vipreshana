import { Renderer, Program, Mesh, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0, 1);
}`;

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p ,vec2(127.1,311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
    mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
}

void main() {
  vec2 uv = vUv * uResolution.xy / min(uResolution.x, uResolution.y);

  // Base background
  vec3 bgColor = vec3(0.97, 0.99, 1.0);

  // Dynamic road/path highlights using noise
  float t = uTime * 0.15;
  float n = noise(uv * 3.0 + vec2(t, t));
  float routeLines = smoothstep(0.4, 0.5, n);

  // Subtle moving parcel blips
  float blipTrail = 0.0;
  for (float i = 0.0; i < 10.0; i++) {
    vec2 pos = vec2(mod(uTime * 0.1 + i * 0.1, 1.0), 0.2 + sin(i + uTime * 0.3) * 0.1);
    float d = distance(vUv, pos);
    blipTrail += smoothstep(0.03, 0.0, d);
  }

  vec3 routeColor = vec3(0.2, 0.6, 1.0);
  vec3 parcelColor = vec3(1.0, 0.4, 0.2);

  vec3 color = bgColor;
  color = mix(color, routeColor, routeLines * 0.15);
  color = mix(color, parcelColor, blipTrail);

  gl_FragColor = vec4(color * uColor, 1.0);
}`;

export default function LiveBackgroundLight({ color = [0.9, 0.95, 1.0] }) {
  const ctnRef = useRef(null);

  useEffect(() => {
    if (!ctnRef.current) return;
    const ctn = ctnRef.current;

    const renderer = new Renderer({ dpr: 1 });
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: color },
        uResolution: {
          value: [gl.canvas.width, gl.canvas.height, 1],
        },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      program.uniforms.uResolution.value = [
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height,
      ];
    }

    window.addEventListener("resize", resize);
    resize();

    ctn.appendChild(gl.canvas);

    let animId;
    function update(t) {
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
      animId = requestAnimationFrame(update);
    }

    animId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      ctn.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color]);

  return <div ref={ctnRef} className="w-full h-full" />;
}
