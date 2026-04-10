import { useEffect, useState } from 'react'
import { supabase } from "./supabaseClient";

// Add "export default" here
export default function useSalesData() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.rpc('get_product_monthly_revenue')

      if (error) {
        console.error(error)
      } else {
        setData(data)
        console.log("Fetched product monthly revenue from supabase:", data) // Debug log
      }
    }

    fetchData()
  }, [])

  return data
}