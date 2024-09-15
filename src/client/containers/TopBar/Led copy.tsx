
export interface ILed {
    actionColor: string;

}
const Led: React.FC<ILed> = ({ actionColor }) => {
    return (
        <div className=''>
            <div className="led-box">
                <div className={`led-${actionColor}`}></div>
            </div>
        </div>
    );
}

export default Led;
