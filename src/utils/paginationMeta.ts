export default function paginationMeta({ limit, page, total }: { page: number; limit: number; total: number }) {
  return {
    page, // trang hiện tại
    limit, // Số lượng bản ghi trên mỗi trang
    totalItems: total, // Tổng số bản ghi trong cơ sở dữ liệu
    totalPages: Math.ceil(total / limit), // tổng số trang
  }
}
