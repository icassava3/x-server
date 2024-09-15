import { Card } from 'ui-neumorphism'

export interface ILed {
    actionColor: string;
}
const Led: React.FC<ILed> = ({ actionColor }) => {
    return (
        // @ts-ignore
        <Card
            flat
            rounded
            width={10}
            height={10}
            style={{
                background: actionColor,
                marginLeft: 7,
            }}
        >
        </Card>
    );
}

export default Led;
