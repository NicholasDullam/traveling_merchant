
const logout = async (req, res) => {
    return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out" });
}

module.exports = {
    logout
}