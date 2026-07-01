import { useEffect, useState } from "react";

function ProductForm({
  product,
  brands,
  categories,
  onSave,
  onCancel,
}) {
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (product) {
      setModel(product.model);
      setDescription(product.description);
      setPrice(product.price);
      setDiscount(product.discount);
      setBrandId(product.brand?.brandId || "");
      setCategoryId(product.category?.categoryId || "");

      if (product.images?.length > 0) {
        setPreview(
          `data:${product.images[0].fileType};base64,${product.images[0].image}`
        );
      } else {
        setPreview(null);
      }

      setImageFile(null);
    } else {
      setModel("");
      setDescription("");
      setPrice("");
      setDiscount("");
      setBrandId("");
      setCategoryId("");
      setImageFile(null);
      setPreview(null);
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      product: {
        model,
        description,
        price: Number(price),
        discount: Number(discount),
        brand: {
          brandId: Number(brandId),
        },
        category: {
          categoryId: Number(categoryId),
        },
      },
      imageFile,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "15px" }}>
        <label>Modelo</label>

        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Descripción</label>

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Precio</label>

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Descuento (%)</label>

        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          required
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Marca</label>

        <select
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          required
          style={{ width: "100%", padding: "10px" }}
        >
          <option value="">Seleccione...</option>

          {brands.map((brand) => (
            <option
              key={brand.brandId}
              value={brand.brandId}
            >
              {brand.brandName}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Categoría</label>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          style={{ width: "100%", padding: "10px" }}
        >
          <option value="">Seleccione...</option>

          {categories.map((category) => (
            <option
              key={category.categoryId}
              value={category.categoryId}
            >
              {category.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Imagen</label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];

            if (!file) return;

            setImageFile(file);
            setPreview(URL.createObjectURL(file));
          }}
        />

        {preview && (
          <img
            src={preview}
            alt="Vista previa"
            style={{
              width: "180px",
              marginTop: "15px",
              borderRadius: "8px",
              display: "block",
            }}
          />
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <button
          type="button"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button type="submit">
          Guardar
        </button>
      </div>
    </form>
  );
}

export default ProductForm;