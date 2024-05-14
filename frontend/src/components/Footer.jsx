import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";

export default function FooterCom() {
    return (
        <Footer container className='border border-t-8 border-teal-500'> 
        <div className="w-full max-w-7xl mx-auto">
            <div className="">
                <div className="">
                    <Link
                    to='/'
                    className='self-center whitespace-nowrap text-sm sn:text-xl
                    font-semibold dark:text:white'>   
                    <span className='px-2 py-1 bg-gradient-to-bl from-blue-950 via-blue-700 to-blue-300 rounded-lg text-white'>
                        Добро
                    </span>
                    Вместе
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 sm: mt-4 sm:grid-cols-3 sm:gap-6">
                    <Footer.Title title="About" />
                    <Footer.LinkGroup col>
                        <Footer.Link href='/about' target='_blank' rel='noopener noreferrer'>
                            ДоброВместе
                        </Footer.Link>
                    </Footer.LinkGroup>
                </div>
                <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link href='#'>Privacy Policy</Footer.Link>
                <Footer.Link href='#'>Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
            </div>
        </div>
        </Footer>
    )
}