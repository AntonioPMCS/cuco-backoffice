import { Link } from "react-router-dom"
import "../styles/NotFound.css"


const NotFoundPage = () => {
  return (
    <div className="error-page">
      404 Not Found
      <Link to="/">Home</Link>
    </div>
  )
}

export default NotFoundPage
