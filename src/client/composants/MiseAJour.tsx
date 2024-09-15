import { useEffect, useState } from 'react';
import { Body2, Button, Card, CardAction, CardContent, CardHeader, Dialog, H6, Subtitle2 } from 'ui-neumorphism';
const ipcRenderer = window.require('electron').ipcRenderer;

function MiseAJour() {

    const [isOpen, setIsOpen] = useState(false);
    const [version, setVersion] = useState("");


    const restartApp = () => {
        ipcRenderer.send('restart-and-update');
    }

    useEffect(() => {
        ipcRenderer.on('new-update', (event: any, data: { version: string }) => {
            setVersion(data.version);
            setIsOpen(true);
        });
    }, []);

    return (
        // @ts-ignore
        <Card >
            {/* @ts-ignore */}
            <Dialog visible={isOpen} >
                {/* @ts-ignore */}
                <Card width={450} height={280} style={{ paddingTop: "10px" }}>
                    {/* @ts-ignore */}
                    <CardHeader
                        title={
                            // @ts-ignore
                            <H6>Nouvelle mise à jour</H6>
                        }
                        subtitle={
                            // @ts-ignore
                            <Subtitle2 secondary>{`Version: ${version}`}</Subtitle2>}
                        style={{ paddingBottom: "20px" }}
                    />
                    {/* @ts-ignore */}
                    <CardContent style={{ marginBottom: "40px", backgroundColor: 'red', padding: "10px" }}>
                        {/* @ts-ignore */}
                        <Body2 style={{ color: "white" }}>
                            Nouvelle version disponible.
                            Veuillez cliquer sur le bouton relancer pour redémarrer
                            l'application en vue d'appliquer la mise à jour.
                        </Body2>
                    </CardContent>
                    {/* @ts-ignore */}
                    <CardAction style={{ justifyContent: "flex-end", marginRight: "15px" }}>
                        {/* @ts-ignore */}
                        <Button style={{ marginRight: "20px" }} onClick={() => setIsOpen(false)}>Annuler</Button>
                        {/* @ts-ignore */}
                        <Button color='#fff' bgColor='var(--primary)' onClick={() => restartApp()} >Relancer</Button>
                    </CardAction>
                </Card>
            </Dialog>
        </Card>
    )
}

export default MiseAJour