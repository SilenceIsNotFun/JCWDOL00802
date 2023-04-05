import {useSelector} from "react-redux"
import React,{useState,useEffect,} from "react"
import Axios  from "axios"
import { API_URL } from "../helper"
import {format} from "date-fns"
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Link,
  } from '@chakra-ui/react'

function ReportSales() {

   const [salesData,setSalesData]= useState([])
   const [dataExist,setDataExist]= useState(false)
   const [pendapatan,setPendapatan]= useState(0);
   const [pesanan,setPesanan]= useState(0);
   const [penjualan,setPenjualan]= useState(0)
   const [bulan,setBulan]= useState(0)
   const [namaBulan,setNamaBulan]= useState()
   const [tahun,setTahun]=useState()
   const [dataTahun,setDataTahun]=useState()
   const [dataCategory,setDataCategory]=useState()
   const [dataWarehouse,setDataWarehouse]=useState()
   const [selectedWarehouse,setSelectedWarehouse]= useState("")
   const [selectedCategory,setSelectedCategory]=useState("")
   const [search,setSearch]=useState("")
   const [placebo,setPlacebo]=useState("search")
   const {id_user,role} = useSelector((state) => {
    return {
      id_user: state.userReducer.id_user,
      role: state.userReducer.role,
    };})


    const getTransaction = async ()=>{
      let getLocalStorage = localStorage.getItem("cnc_login")
        const formattedBulan= parseInt(bulan)+1;
        const formattedTahun= parseInt(tahun)
        Axios.get(`${API_URL}/product/sales?bulan=${formattedBulan}&tahun=${formattedTahun}&search=${search}&warehouse=${selectedWarehouse}&category=${selectedCategory}`,
        {
          headers: {
      Authorization: `Bearer ${getLocalStorage}`,
    },
        })
        .then(
            (response)=>{
                setSalesData(response.data)
                if(response.data.length>0){
                  setDataExist(true)
                }else {setDataExist(false)}
                
            }
        )
    }
    
    const getCategory = async ()=>{
      let getLocalStorage = localStorage.getItem("cnc_login")
      Axios.get(`${API_URL}/product/category`)
      .then(
          (response)=>{
           
              setDataCategory(response.data)
          }
      )
    }
    const getWarehouse = async ()=>{
      let getLocalStorage = localStorage.getItem("cnc_login")
      Axios.get(`${API_URL}/product/warehouse`,{
        headers: {
    Authorization: `Bearer ${getLocalStorage}`,
  },
      })
      .then(
          (response)=>{
            
              setDataWarehouse(response.data)
          }
      )
    }

    const getPesanan = ()=>{
        const data = salesData
        if (salesData){
        const pendapatan = data.reduce((accumulator,val)=>accumulator+parseInt(val?.total_biaya),0)
        setPendapatan(pendapatan)
       
        const pesanan = data.reduce((accumulator,val)=>accumulator+parseInt(val?.total_pesanan),0)
        setPesanan(pesanan)
        
        const penjualan = data.reduce((accumulator,val)=>accumulator+parseInt(val?.jumlah),0)
        setPenjualan(penjualan)
        
        
    }
}
    const setDefault =()=>{
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "July", "Agustus", "September", "Oktober", "November", "Desember"]
        const month = new Date().getMonth()
        const year = new Date().getFullYear()
        const baseYear= 2022
        const dataYear =[]
        for(let i = parseInt(year); i >=baseYear; i--){
          dataYear.push(i)
        }
        setDataTahun(dataYear)
        setBulan(month)
        setNamaBulan(monthNames[month])
        setTahun(year)
    }

    const setMonth =(month)=>{
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "July", "Agustus", "September", "Oktober", "November", "Desember"]
        setBulan(month)
        setNamaBulan(monthNames[month])
    }

    const printMonth =()=>{
        let data = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "July", "Agustus", "September", "Oktober", "November", "Desember"]
        return data.map((val, idx) => {
            return <option value={idx} selected = {idx == bulan}>{val}</option>;
          });
    }
    const printYear =()=>{
      let data = dataTahun
      if (dataTahun){
      return data.map((val, idx) => {
          return <option value={val} selected = {val == tahun}>{val}</option>;
        });
      }
    }
    const printCategory =()=>{
      let data = dataCategory
      if (dataCategory){
      return data.map((val, idx) => {
          return <option value={val?.id_category} selected = {val.id_category == selectedCategory}>{val?.category}</option>;
        });
      }
    }
    const printWarehouse =()=>{
      let data = dataWarehouse
      if (dataWarehouse){
      return data.map((val, idx) => {
          return <option value={val?.id_warehouse} selected = {val.id_warehouse == selectedWarehouse}>{val?.warehouse_branch_name}</option>;
        });
      }
    }



    useEffect(() => {
        setDefault()
    }, []);
    useEffect(() => {
      getCategory()
  }, [id_user]);
  useEffect(() => {
    getWarehouse()
}, [id_user]);
    useEffect(() => {
        getTransaction()
    }, [bulan,tahun,selectedCategory,selectedWarehouse,search]);
    useEffect(() => {
        getPesanan()
    }, [salesData]);

    const printData=()=>{
        let data = salesData
        if (salesData !== null){
        return data.map((val,idx)=>{
            let linkproduct= `/detail/${val.id_product}`
            let total_biaya = parseInt(val?.total_biaya)
            return <Tr>
            <Td>
                <Link href= {linkproduct}>{val?.name}</Link>
            </Td>
            <Td isNumeric>Rp.{total_biaya.toLocaleString()}</Td>
            <Td isNumeric>{val?.jumlah}</Td>
            <Td isNumeric>{val?.total_pesanan}</Td>
          </Tr>
        })
    } 
    
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        
        setSearch(placebo);
      }
    }
    const handleChange = (event) => {
      setPlacebo(event.target.value);
    };



  return (
    <div>
      <input
        type="text"
        id="message"
        name="message"
        value={placebo}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
        <div className=" container" >
        <TableContainer>
  <Table variant='simple'>
    {
        !dataExist &&
    <TableCaption>tidak Ada Data</TableCaption>
    }
    <Thead>
      <Tr>
        <Th>Nama Produk</Th>
        <Th isNumeric>Pendapatan</Th>
        <Th isNumeric>Terjual</Th>
        <Th isNumeric>Pesanan</Th>
      </Tr>
    </Thead>
    <Tbody>
    {printData()}
    </Tbody>
    
  </Table>
</TableContainer>
        </div>

        <div> total pendapatan bulan {namaBulan} = Rp {pendapatan.toLocaleString()}</div>
        <div> total pesanan bulan {namaBulan} = {pesanan}</div>
        <div> total penjualan produk bulan {namaBulan} = {penjualan}</div>
        <div className="my-3 ">
              <label className="form-label fw-bold text-muted">Pilih Report di Bulan</label>
              <select
                onChange={(e)=>setMonth(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
                
                {printMonth()}
              </select>
            </div>
            <div className="my-3 ">
              <label className="form-label fw-bold text-muted">Pilih Tahun</label>
              <select
                onChange={(e)=>setTahun(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
                
                {printYear()}
              </select>
            </div>
            <div className="my-3 ">
              <label className="form-label fw-bold text-muted">Pilih Category</label>
              <select
                onChange={(e)=>setSelectedCategory(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
                <option value="">all category</option>
                {printCategory()}
              </select>
              
            </div>
            <div className="my-3 ">
              <label className="form-label fw-bold text-muted">Pilih warehouse</label>
              <select
                onChange={(e)=>setSelectedWarehouse(e.target.value)}
                className="form-control form-control-lg mt-3"
              >
              {role == 3 &&
               <option value="">all warehouse</option>}
                {printWarehouse()}
              </select>
              
            </div>

    </div>
  )
}

export default ReportSales