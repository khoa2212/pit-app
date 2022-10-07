import { useState } from 'react';

const KiemTraDauVao = (TongThuNhap, SoNguoi) => {
    const ttn = parseFloat(TongThuNhap);
    const sn = parseInt(SoNguoi);

    if (ttn <= 0 || isNaN(TongThuNhap) || sn < 0 || isNaN(SoNguoi)) {
        return "Đầu vào không hợp lệ";
    }
    else {
        return "Thông báo";
    }
}

const TinhThue = (TongThuNhap, SoNguoi) => {
    const ttn = parseFloat(TongThuNhap) / Math.pow(10, 6);
    const sn = parseInt(SoNguoi);

    const ThuNhapTinhThue = ttn - 11 - (4.4 * sn);

    const ThueSuatTruocDo = [0.25, 0.75, 1.65, 3.25, 5.85, 9.85];
    const ThueSuat = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35];
    let res = 0;
    let message = "Thông báo";

    // 0 < x <=5
    // 5 < x <= 10
    // 10 < x <= 18
    // 18 < x <= 32
    // 32 < x <= 52
    // 52 < x <= 80
    // 80 < x

    if (ThuNhapTinhThue <= 0) {
        message = "Không chịu thuế";
    }
    else if (ThuNhapTinhThue <= 5) {
        res = ThuNhapTinhThue * ThueSuat[0];
    }
    else if (ThuNhapTinhThue <= 10) {
        res = ThuNhapTinhThue * ThueSuat[1] - ThueSuatTruocDo[0]
    }
    else if (ThuNhapTinhThue <= 18) {
        res = ThuNhapTinhThue * ThueSuat[2] - ThueSuatTruocDo[1]
    }
    else if (ThuNhapTinhThue <= 32) {
        res = ThuNhapTinhThue * ThueSuat[3] - ThueSuatTruocDo[2]
    }
    else if (ThuNhapTinhThue <= 52) {
        res = ThuNhapTinhThue * ThueSuat[4] - ThueSuatTruocDo[3]
    }
    else if (ThuNhapTinhThue <= 80) {
        res = ThuNhapTinhThue * ThueSuat[5] - ThueSuatTruocDo[4]
    }
    else {
        res = ThuNhapTinhThue * ThueSuat[6] - ThueSuatTruocDo[5]
    }
    res = res * Math.pow(10, 6);
    return {
        res: Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(res),
        message: message,
    }
}

export default function PIT() {

    const [warning, setWarning] = useState("Thông báo");
    const [result, setResult] = useState("0 ₫");

    const [formData, setFormData] = useState({
        income: "",
        numberofpeople: "",
    });

    const handleChangeExpr = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            }
        })
        const { income, numberofpeople } = formData;
        setWarning(KiemTraDauVao(income, numberofpeople));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const { income, numberofpeople } = formData;
        if (KiemTraDauVao(income, numberofpeople) !== "Thông báo") {
            setResult("0 ₫")
            return;
        }
        const info = TinhThue(income, numberofpeople);
        setResult(info.res)
        setWarning(info.message)
    }
    return (
        <div className='container'>
            <h1> Tính thuế thu nhập cá nhân </h1>
            <form onSubmit={handleSubmit}>
                <div className='row col-md-6'>
                    <input placeholder='Tổng thu nhập' type="text" name='income' value={formData.income} onChange={handleChangeExpr} />
                </div>
                <div className='row col-md-6'>
                    <input placeholder='Số người phụ thuộc' type="text" name='numberofpeople' value={formData.numberofpeople} onChange={handleChangeExpr} />
                </div>
                <div className='row col-md-6 box'>
                    <div>
                        <div className='inner'><b>Thuế cần nộp: {result}</b></div>
                        <div className='inner'><button type='submit'>tính</button></div>
                    </div>
                </div>
                <div className='row col-md-6 box1'>
                    <div className='lable'>{warning}</div>
                </div>
            </form>
        </div>
    );
}