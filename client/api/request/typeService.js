import axios from '../axios'

const getAllTypes = async () => {
  const res = await axios.get(`/type`)
  return res.data
}

const getTypeById = () => {}

const addType = async (data) => {
  const res = await axios.post('/type', {typeName: data})
  return res
}

const editType = (data) => {}

const deleteType = (id) => {}

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  getAllTypes,
  getTypeById,
  addType,
  editType,
  deleteType,
}
