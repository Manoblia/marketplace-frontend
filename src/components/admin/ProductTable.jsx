function ProductTable({
  products,
  onEdit,
  onDelete,
}) {
  const getProductImage = (product) => {
    if (product.images?.length > 0) {
      return `data:${product.images[0].fileType};base64,${product.images[0].image}`;
    }

    return "https://via.placeholder.com/80x80?text=STEP";
  };

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "#fff",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,.08)",
      }}
    >
      <thead>
        <tr
          style={{
            background: "#111",
            color: "#fff",
          }}
        >
          <th style={{ padding: "14px", textAlign: "left" }}>
            Imagen
          </th>
          <th style={{ textAlign: "left" }}>Modelo</th>
          <th style={{ textAlign: "left" }}>Marca</th>
          <th style={{ textAlign: "left" }}>Categoría</th>
          <th style={{ textAlign: "left" }}>Precio</th>
          <th style={{ textAlign: "left" }}>Descuento</th>
          <th style={{ textAlign: "left" }}>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {products.length === 0 ? (
          <tr>
            <td
              colSpan="7"
              style={{
                padding: "25px",
                textAlign: "center",
                color: "#777",
              }}
            >
              No se encontraron productos.
            </td>
          </tr>
        ) : (
          products.map((product) => (
            <tr
              key={product.productId}
              style={{
                borderBottom: "1px solid #eee",
              }}
            >
              <td style={{ padding: "14px" }}>
                <img
                  src={getProductImage(product)}
                  alt={product.model}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </td>

              <td>{product.model}</td>

              <td>{product.brand?.brandName}</td>

              <td>{product.category?.categoryName}</td>

              <td>
                ARS{" "}
                {product.price?.toLocaleString("es-AR")}
              </td>

              <td>{product.discount}%</td>

              <td>
                <button
                  onClick={() => onEdit(product)}
                  style={{
                    marginRight: "10px",
                    padding: "8px 12px",
                    border: "1px solid #111",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(product.productId)}
                  style={{
                    padding: "8px 12px",
                    border: "none",
                    background: "#c62828",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default ProductTable;