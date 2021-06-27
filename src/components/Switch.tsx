import { useTheme } from '../hooks/useTheme';

import '../styles/components/switch.scss'

export function Switch() {
    const { toggleTheme } = useTheme()

    return (
        <div className="switch">
            <input 
              type="checkbox" 
              className="checkbox" 
              id="checkbox" 
              onChange={toggleTheme} 
            />
            <label htmlFor="checkbox" className="label">
                <div className="ball"></div>
            </label>
        </div>
    );
}