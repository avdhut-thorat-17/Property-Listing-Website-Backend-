import user from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const getUsers = async (req, res) => {
    const userInfo = await user.find();
    console.log(userInfo);
    res.status(200).json(userInfo);
};

export const getUser = async (req, res) => {
    const userInfo = await user.findById(req.params.id);
    res.status(200).json(userInfo);
};

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { password, avatar, ...inputs } = req.body;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "Not Authorized!" });
    }

    try {
        let updatedData = { ...inputs };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        if (avatar) {
            updatedData.avatar = avatar;
        }

        const updatedUser = await user.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        );

        // Generate new token with updated username/email
        const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });

        const { password: _, ...rest } = updatedUser.toObject();
        res.status(200).json({ user: rest, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "Not Authorized!" });
    }
    try {
        await user.findByIdAndDelete(id);
        res.status(200).json({ message: "User Deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to delete user" });
    }
};
