import { Link } from "react-router-dom"

export default function NotFound(){
    return(
        <div className="container fit-content mx-auto mt-5">
            <h1 className="text-center">404</h1>
            <h1 className="text-center">Page Not Found</h1>
            <h4 className="text-center"><Link to={'/'}>Home</Link></h4>
        </div>
    )
}