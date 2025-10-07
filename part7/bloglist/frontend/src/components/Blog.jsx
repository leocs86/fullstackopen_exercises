import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";

import { Link, Typography } from "@mui/material";

const Blog = ({ blog }) => {
    return (
        <Link component={RouterLink} to={`/blogs/${blog.id}`}>
            <Typography>
                {blog.title} (by {blog.author})
            </Typography>
        </Link>
    );
};

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
};

export default Blog;
