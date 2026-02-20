import os

base_path = '/Users/themac/Documents/tora-landing-page copy'
logo_txt_path = os.path.join(base_path, 'public/logo_base64_fresh.txt')
component_path = os.path.join(base_path, 'src/components/sections/infrared/LogoEmergence.tsx')

# Read base64 string
try:
    with open(logo_txt_path, 'r') as f:
        base64_str = f.read().strip()
except FileNotFoundError:
    print("Error: Base64 file not found.")
    exit(1)

# New component content with Base64 and DEBUG text
new_content = f"""
import {{ useEffect }} from "react";
import {{ motion }} from "framer-motion";

interface LogoEmergenceProps {{
    onComplete: () => void;
}}

export function LogoEmergence({{ onComplete }}: LogoEmergenceProps) {{
    useEffect(() => {{
        // ULTRA LONG duration for debugging
        const timer = setTimeout(onComplete, 15000); 
        return () => clearTimeout(timer);
    }}, [onComplete]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-[9999] bg-black/50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8 relative border-4 border-green-500 p-4"
            >
                <h1 className="text-green-500 text-3xl font-bold mb-4 text-center bg-black p-2">
                    DEBUG: BASE64 VERSION LOADED
                </h1>
                
                <div className="w-64 md:w-80 relative z-50 bg-white/10 p-2">
                    <img
                        src="data:image/png;base64,{base64_str}"
                        alt="TORA LOGO DEBUG"
                        className="w-full h-auto"
                        style={{ display: 'block', maxWidth: '100%' }}
                    />
                </div>
            </motion.div>

            <p className="text-white text-xl font-bold">If you see this text, the component IS updating.</p>
        </div>
    );
}}
"""

with open(component_path, 'w') as f:
    f.write(new_content)
print("Successfully replaced LogoEmergence with DEBUG Base64 version.")
