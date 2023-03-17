import axios from '../axios'

const getAllPublisher = async () => {
  const res = await axios.get(`/publisher`)
  return res.data
}

const getPublisherById = () => {}

const addPublisher = async (data) => {
  const res = await axios.post('/publisher', {publisherName: data})
  return res
}

const editPublisher = (data) => {}

const deletePublisher = (id) => {}

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  getAllPublisher,
  getPublisherById,
  addPublisher,
  editPublisher,
  deletePublisher,
}
