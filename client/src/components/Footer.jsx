import favicon from '../../images/favicon.png';

const Footer = () => {
    return (
        //Formats the footer at the bottom of the webpage
        <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer" id="footer">
            <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
                <div className="flex flex-[0.5] justify-center items-center">
                    <img src={favicon} alt="favicon" className="w-16"/>
                </div>
                {/* 4 Hyperlinks that takes user to my other links or different parts of the webpage*/}
                <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
                    <a className="text-white text-base text-center mx-2 cursor-pointer" href="https://github.com/yulppuma" target="_blank">Github</a>
                    <a className="text-white text-base text-center mx-2 cursor-pointer" href="https://www.linkedin.com/in/yul-puma/" target="_blank">LinkedIn</a>
                    <a className="text-white text-base text-center mx-2 cursor-pointer" href="#footer">Transactions</a>
                    <a className="text-white text-base text-center mx-2 cursor-pointer" href="#">Back To Top</a>
                </div>
            </div>
            <div className="flex justify-center items-center flex-col mt-5">
                <p className="text-white text-sm text-center">See more</p>
                <a className="text-white text-sm text-center" href="https://github.com/yulppuma" target="_blank">github.com/yulppuma</a>
            </div>
            {/*Separation line for credits*/}
            <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5"/>
            <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
            <p className="text-white text-sm text-center">@yulppuma</p>
            <p className="text-white text-sm text-center">All rights reserved</p>
            </div>
        </div>
    );
}

export default Footer;