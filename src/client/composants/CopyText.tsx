import { mdiCheck, mdiContentCopy } from '@mdi/js';
import Icon from '@mdi/react';
import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

export interface ICopyTextProps {
    useDarkMode: boolean;
    texteACopier: string;

}

const CopyText: React.FC<ICopyTextProps> = ({ useDarkMode, texteACopier }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        // Réinitialisez l'état "copied" après un certain délai si nécessaire
        setTimeout(() => {
            setCopied(false);
        }, 3000); // Réinitialisation après 3 secondes (facultatif)
    };

    return (
        <CopyToClipboard text={texteACopier} onCopy={handleCopy}>
            <Icon style={{ cursor: "pointer" }} path={copied ? mdiCheck : mdiContentCopy} size={0.5} />
        </CopyToClipboard>
    );
}

export default CopyText