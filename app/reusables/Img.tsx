import Image, { ImageProps} from "next/image";

interface ImgProps extends Omit<ImageProps, "alt"> {
    alt?: string;
}

const Img: React.FC<ImgProps> = ({ alt = "", ...props }) => {
    return (
      <Image 
       unoptimized={true}
       alt={alt}
       {...props}
      />
    );
};

export default Img;