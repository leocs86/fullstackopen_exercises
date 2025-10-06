import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Blog = ({ blog }) => {
    return (
        <Link to={`/blogs/${blog.id}`}>
            <p data-testid="title-author">
                {blog.title} (by {blog.author})
            </p>
        </Link>
    );
};

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
};

export default Blog;
