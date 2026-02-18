import math

def generate_am_signal():
    """
    Generates an animated AM signal SVG.
    Envelope: A(x) = (1 + 24 * (|x - 400| / 400))  <- High (25) at edges, Low (1) at center.
    Also using a smoother envelope: A(x) = 1 + 24 * ((x-400)/400)**2 ?
    User asked for "High -> Low -> High". "Bowtie" implies linear envelope.
    Let's stick to linear or slightly curved for aesthetics.
    Linear: |x - 400|/400.
    Carrier: sin(k*x - phase).
    """

    width = 800
    height = 60
    center_y = 30
    center_x = 400
    
    # Parameters
    cycles = 40  # High frequency
    amplitude_max = 24 # Max peak from center (total height ~48 + padding)
    amplitude_min = 2  # Min peak at center (so it doesn't vanish completely)
    
    # We need 4 keyframes for the animation loop: 0, pi/2, pi, 3pi/2, 2pi
    # 5 frames because 0 and 2pi are identical shapes but needed for interpolation?
    # Actually 0 and 2pi are the same. SMIL interpolates from value to value.
    # To loop smoothly, we need `values="d1; d2; d3; d4; d1"`.
    
    phases = [0, 0.5 * math.pi, math.pi, 1.5 * math.pi, 2 * math.pi]
    path_strings = []

    for phase in phases:
        points = []
        # Generate points
        # Step size 2px for smoothness
        for x in range(0, width + 1, 2):
            # Normalized x from -1 to 1
            u = (x - center_x) / center_x 
            
            # Envelope function (Bowtie)
            # Linear bowtie: abs(u)
            # Smooth bowtie: u^2
            # Let's use a mix? 0.5*linear + 0.5*smooth?
            # User said "Bowtie or hourglass". Hourglass usually implies smooth curve.
            # Let's use u^2 for smoother center.
            # envelope_val = u**2 
            # Actually linear looks more "signal-like" for nodes.
            envelope_val = abs(u)
            
            amp = amplitude_min + (amplitude_max - amplitude_min) * envelope_val
            
            # Carrier wave
            # Angle = (x / width) * cycles * 2pi - phase
            angle = (x / width) * cycles * 2 * math.pi - phase
            
            y = center_y + amp * math.sin(angle)
            points.append(f"{x},{y:.1f}")
            
        path_strings.append("M" + " L".join(points))

    # Construct SVG
    # Gradient
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" fill="none">
  <defs>
    <linearGradient id="am" x1="0" y1="0" x2="{width}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="50%" stop-color="#22D3EE"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
  </defs>

  <!-- AM Signal Path -->
  <path d="{path_strings[0]}" stroke="url(#am)" stroke-width="1.5" stroke-linecap="round" fill="none">
    <animate attributeName="d" 
             values="{';'.join(path_strings)}" 
             dur="4s" 
             repeatCount="indefinite"
             calcMode="linear"/>
  </path>
</svg>'''

    with open('../assets/am-signal.svg', 'w') as f:
        f.write(svg_content)
    
    print("SVG generated successfully.")

if __name__ == "__main__":
    generate_am_signal()
