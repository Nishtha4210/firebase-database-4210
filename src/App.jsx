import { useEffect, useState } from "react";
import { db } from "./firebase";
import { addDoc, collection, getDocs, deleteDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [user, setUser] = useState([]);
  const [record, setRecord] = useState({});
  const [index, SetIndex] = useState(null); 
  const getCollection = collection(db, "lists");

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    let userData = await getDocs(getCollection);
    let userRecord = [];

    userData.docs.map((doc) => {
      let obj = { ...doc.data(), id: doc.id };
      userRecord.push(obj);
    });

    setUser(userRecord);
  };

  const getInput = (e) => {
    let { name, value } = e.target;
    setRecord({ ...record, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (record.name && record.email) {
      if (index) {
        
        const userDoc = doc(db, "lists", index);
        await updateDoc(userDoc, record);
      } else {
      
        await addDoc(getCollection, record);
      }

      getUserData();
      setRecord({}); 
      SetIndex(null); 
    }
  };

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "lists", id));
    getUserData();
  };

  const updateUser = async (id) => {
    let getUser = doc(db, "lists", id);
    let singleUser = await getDoc(getUser);
    setRecord(singleUser.data());
    SetIndex(id); 
  };

  return (
    <div className="container mt-5">
      <h4 className="mb-3">Form</h4>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow bg-dark">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={record.name || ""}
            onChange={getInput}
            className="form-control"
            placeholder="Enter name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={record.email || ""}
            onChange={getInput}
            className="form-control"
            placeholder="Enter email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={record.password || ""}
            onChange={getInput}
            className="form-control"
            placeholder="Enter Password"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          {index ? "Update" : "Submit"}
        </button>
      </form>

      <h4 className="mt-5">User List</h4>
      <table className="table table-bordered table-striped mt-3 bg-dark">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {user.map((v, i) => (
            <tr key={v.id}>
              <td>{i + 1}</td>
              <td>{v.name}</td>
              <td>{v.email}</td>
              <td>{v.password}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => deleteUser(v.id)}>
                  Delete
                </button>
                <button className="btn btn-success btn-sm ms-2" onClick={() => updateUser(v.id)}>
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

