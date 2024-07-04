import { useEffect, useState } from "react";
import { request } from "api";
import { Input, FormControl, InputLabel, Select, MenuItem, IconButton, Typography, Avatar, Box, Button, Modal, TextField, Alert } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import './css/GroupMember.css';
import ConfirmationModal from "components/modal/ConfirmationModal";

const GroupMember = ({groupWalletId}) => {
    const createdUserId = localStorage.getItem('userId');
    const [members, setMembers] = useState([]);
    const [groupMemberId, setGroupMemberId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [newMember, setNewMember] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isModalChangeRole, setIsModalChangeRole] = useState(false);
    const [formData, setFormData] = useState({
        userId: "",
        createdUserId: createdUserId,
        groupWalletId: groupWalletId,
        role: "MEMBER"
    });

    useEffect(() => {
        request("get", `group/members/all/${groupWalletId}`, (res) => {
            setMembers(res.data);
            console.log(res.data);
        }).then();

    }, []);

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddMember = () => {
        request("post", `/group/members`, (res) => {
            console.log(res.data);
            if(res.data) {
                // Sau khi tạo xong, reset dữ liệu và đóng modal
                setFormData({
                    userId: "",
                    createdUserId: createdUserId,
                    groupWalletId: groupWalletId,
                    role: "MEMBER"
                });
                setOpenModal(false);
                setMembers(res.data);
            } else {
                setAlertMessage("Can't find user. Please try again!");
                setTimeout(() => {
                    setAlertMessage("");
                }, 5000);
            }
        }, (error) => {
            setTimeout(() => {
                setAlertMessage("");
            }, 5000);
        }, formData);
    };

    const handleClickOpenModalDelete = (groupMemberId) => {
        setGroupMemberId(groupMemberId);
        setIsModalDeleteOpen(true);
    };
    
    const handleClickCloseModalDelete = () => {
        setGroupMemberId(null);
        setIsModalDeleteOpen(false);
    };

    const handleClickOpenModalChangeRole = (groupMemberId) => {
        setGroupMemberId(groupMemberId);
        setIsModalChangeRole(true);
    };
    
    const handleClickCloseModalChangeRole = () => {
        setGroupMemberId(null);
        setIsModalChangeRole(false);
    };

    const handleDeleteMember = (groupMemberId) => {
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("patch", `/group/members/delete-member/${groupMemberId}`, (res) => {
            setIsModalDeleteOpen(false);
            setMembers(res.data);
        }, (error) => {
            console.error("Error when delete member:", error);
            // Xử lý lỗi nếu cần thiết
        }, formData);
        setIsModalDeleteOpen(false);
    };

    const handleChangeRole = (groupMemberId) => {
        // Gửi dữ liệu lên cơ sở dữ liệu
        request("patch", `/group/members/${groupMemberId}`, (res) => {
            setIsModalChangeRole(false);
            setMembers(res.data);
        }, (error) => {
            console.error("Error when change role of member:", error);
            // Xử lý lỗi nếu cần thiết
        }, formData);
        setIsModalChangeRole(false);
    };

    const isAdmin = (userId) => {
        const member = members.find(m => m.user.userId === userId);
        return member && member.role === "ADMIN";
    };

    return (
        <div>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">Group Members</Typography>
                {isAdmin(createdUserId) && (
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
                        Add Member
                    </Button>
                )}
            </Box>
            {members.map((member) => (
                <Box key={member.groupMemberId} display="flex" alignItems="center" p={2} borderBottom="1px solid #ddd">
                    <Avatar alt={member.user.firstName} src={member.user.profilePicture || "/static/images/avatar/1.jpg"} />
                    <Box ml={2} flex="1">
                        <Typography variant="h6">{member.user.firstName} {member.user.lastName}</Typography>
                        <Typography variant="body2"><PersonIcon fontSize="small" /> {member.user.username}</Typography>
                        <Typography variant="body2"><EmailIcon fontSize="small" /> {member.user.email}</Typography>
                    </Box>
                    <IconButton size="large" onClick={() => handleClickOpenModalChangeRole(member.groupMemberId)}>
                        <StarIcon style={{ color: member.role === "ADMIN" ? "gold" : "grey" }} />
                    </IconButton>
                    {isAdmin(createdUserId) && (
                        <>
                            <IconButton size="large" onClick={() => handleClickOpenModalDelete(member.groupMemberId)} style={{ color: "red" }}>
                                <DeleteIcon />
                            </IconButton>
                        </>
                    )}
                </Box>
            ))}
            <Modal open={openModal} onClose={() => setOpenModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={3} bgcolor="white" borderRadius={2}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        p: 4,
                        borderRadius: 2
                    }}
                >
                    <Typography variant="h6">Add New Member</Typography>
                    <FormControl fullWidth sx={{mb: 2}}>
                        <InputLabel htmlFor="userId">Username or Email</InputLabel>
                        <Input id="userId" name="userId" value={formData.userId} onChange={handleFormChange} />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor="role">Role</InputLabel>
                        <Select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleFormChange}
                            >
                            <MenuItem value="MEMBER">Member</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                        </Select>
                    </FormControl>
                    {alertMessage && <Alert severity="error" sx={{marginBottom: 2}}>{alertMessage}</Alert>}
                    <Button size="large" variant="contained" color="primary" onClick={handleAddMember}>Add Member</Button>
                </Box>
            </Modal>
            {
                isModalDeleteOpen ? 
                <ConfirmationModal
                    open={isModalDeleteOpen}
                    onClose={handleClickCloseModalDelete}
                    onConfirm={() => handleDeleteMember(groupMemberId)}
                    question="Xóa Member"
                    alert="Cảnh báo xóa thành viên của nhóm!"
                /> 
                : null
            }

            {
                isModalChangeRole ? 
                <ConfirmationModal
                    open={isModalChangeRole}
                    onClose={handleClickCloseModalChangeRole}
                    onConfirm={() => handleChangeRole(groupMemberId)}
                    question="Thay đổi vai trò thành viên"
                    alert=""
                /> 
                : null
            }
        </div>
    )
}

export default GroupMember;