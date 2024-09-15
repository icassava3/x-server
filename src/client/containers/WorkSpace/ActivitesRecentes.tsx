import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Dialog } from 'ui-neumorphism';
import ActiviteRecenteBody from '../../composants/ActiviteRecenteBody';
import CardLibelleIcon from '../../composants/CardLibelleIcon';
import { IReduxState } from '../../store/store';


function ActivitesRecentes() {
    const { useDarkMode } = useSelector((state: IReduxState) => state.application);
    const [showDialog, setShowDialog] = useState(false)
    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const cardHeight = showDialog ? (windowHeight - 180) : 410


    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight)
        }
        // Écouteur d'événement pour la mise à jour en temps réel
        window.addEventListener('resize', handleResize);

        // // Nettoyer l'écouteur d'événement lors du démontage du composant
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        // @ts-ignore
        <Card
            dark={useDarkMode}
            height={cardHeight}
            // minWidth={500}
        >
            {/* @ts-ignore */}
            <CardLibelleIcon libelle="Activités récentes" setShowDialog={setShowDialog} showDialog={showDialog} />
            <ActiviteRecenteBody cardContentHeight={300} />
            {/* @ts-ignore */}
            <Dialog
                dark={useDarkMode}
                // width={800}
                minWidth={500}
                visible={showDialog}
                onClose={() => setShowDialog(false)}
            >
                {/* @ts-ignore */}
                <Card
                    dark={useDarkMode}
                    height={cardHeight}
                >
                    <CardLibelleIcon libelle="Activités récentes" setShowDialog={setShowDialog} showDialog={showDialog} />
                    <ActiviteRecenteBody cardContentHeight={windowHeight - 250} />
                </Card>
            </Dialog>
        </Card>
    )
}

export default ActivitesRecentes