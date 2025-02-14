import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

// Định nghĩa kiểu dữ liệu cho User
type User = {
  id: number;
  name: string;
  email: string;
};

const lab6 = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<User[]>(
        "https://jsonplaceholder.typicode.com/users"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserName(user.name);
      setUserEmail(user.email);
    } else {
      setEditingUser(null);
      setUserName("");
      setUserEmail("");
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (userName && userEmail) {
      if (editingUser) {
        // Sửa user
        setUsers(
          users.map((user) =>
            user.id === editingUser.id
              ? { ...user, name: userName, email: userEmail }
              : user
          )
        );
      } else {
        const newUser = {
          id: users.length + 1,
          name: userName,
          email: userEmail,
        };
        setUsers([...users, newUser]);
      }
      setModalVisible(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa người dùng này không?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", onPress: () => setUsers(users.filter(user => user.id !== id)), style: "destructive" },
      ]
    );
  };


  return (
    <View style={styles.container}>

     

      <ScrollView style={{ flex: 1 }}>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <View style={styles.userInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleOpenDialog(item)}
                >
                  <Text style={styles.buttonText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteUser(item.id)}
                >
                  <Text style={styles.buttonText}>Xóa</Text>
                </TouchableOpacity>

                
              </View>
            </View>
          )}
        />
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={() => handleOpenDialog()}>
        <Text style={styles.addButtonText}>Thêm</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingUser ? "Sửa" : "Thêm"}
            </Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="Tên"
            />
            <TextInput
              style={styles.input}
              value={userEmail}
              onChangeText={setUserEmail}
              placeholder="Email"
            />
            <Button title="Lưu" onPress={handleSave} />
            <Button title="Hủy" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#008000",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  userInfo: {
    flex: 6,
  },
  actionButtons: {
    flex: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "gray",
  },
  editButton: {
    backgroundColor: "#FFD700",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default lab6;
