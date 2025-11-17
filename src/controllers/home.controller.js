

const homeController = (req, res) => {
    res.status(200).json({
        status: true,
        message: "Welcome to your Express API!"
    });
};

module.exports = homeController;
