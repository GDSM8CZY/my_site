// Function to ge the polynomial expansion of (a + b)^n
function get_polynomial_expansion() {
    const polynomial = document.getElementById("input").value;

    let num = 0;
    let a = 0;
    let b = 0;
    let n = 0;
    for (let i = 0; i < polynomial.length; i++) {
        let next_num = ["+", "-", "^"]
        if (!isNaN(polynomial[i])) {
            if (num == 0) {
                a = a * 10 + parseInt(polynomial[i], 10);
            }
            else if (num == 1) {
                b = b * 10 + parseInt(polynomial[i], 10);
            }
            else if (num == 2) {
                n = n * 10 + parseInt(polynomial[i], 10);
            }
        }
        else if (next_num.includes(polynomial[i]) && num < 3) {
            num += 1;
        }
    }
    console.log(a, b, n);
}