import Lottie from "lottie-react";
import successAnim from "../assets/success.json";

const SuccessAnimation = ({ size = 150 }) => {
    return (
        <div className="flex justify-center">
            <Lottie
                animationData={successAnim}
                loop={false}
                autoplay={true}
                style={{ width: size, height: size }}
            />
        </div>
    );
};

export default SuccessAnimation;
