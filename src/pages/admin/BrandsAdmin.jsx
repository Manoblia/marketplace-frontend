import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../../store/slices/brandsSlice";

function BrandsAdmin() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.brands);

  const [brandName, setBrandName] = useState("");
  const [editingBrand, setEditingBrand] = useState(null);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = brandName.trim();

    if (!name) {
      alert("Ingresá un nombre de marca");
      return;
    }

    const result = editingBrand
      ? await dispatch(
          updateBrand({
            id: editingBrand.brandId,
            brandName: name,
          })
        )
      : await dispatch(createBrand(name));

    if (
      createBrand.fulfilled.match(result) ||
      updateBrand.fulfilled.match(result)
    ) {
      setBrandName("");
      setEditingBrand(null);
      dispatch(fetchBrands());
      alert(editingBrand ? "Marca actualizada correctamente" : "Marca agregada correctamente");
    } else {
      alert(result.payload || "No se pudo guardar la marca");
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setBrandName(brand.brandName);
  };

  const handleCancelEdit = () => {
    setEditingBrand(null);
    setBrandName("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Desea eliminar esta marca?")) return;

    const result = await dispatch(deleteBrand(id));

    if (deleteBrand.fulfilled.match(result)) {
      dispatch(fetchBrands());
    } else {
      alert(result.payload || "No se pudo eliminar la marca");
    }
  };

  return (
    <section>
      <div style={{ marginBottom: "30px" }}>
        <h1>Administración de Marcas</h1>
        <p style={{ color: "#666" }}>
          Gestioná las marcas disponibles para los productos de la tienda.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
          maxWidth: "650px",
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,.08)",
        }}
      >
        <input
          type="text"
          placeholder="Nombre de la marca"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            border: "1px solid #bbb",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "12px 18px",
            background: "#111",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {editingBrand ? "Guardar cambios" : "+ Agregar"}
        </button>

        {editingBrand && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{
              padding: "12px 18px",
              background: "#fff",
              color: "#111",
              border: "1px solid #111",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {loading && <p>Cargando marcas...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && (
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
            <tr style={{ background: "#111", color: "#fff" }}>
              <th style={{ padding: "14px", textAlign: "left" }}>ID</th>
              <th style={{ textAlign: "left" }}>Marca</th>
              <th style={{ textAlign: "left" }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {items.map((brand) => (
              <tr
                key={brand.brandId}
                style={{ borderBottom: "1px solid #eee" }}
              >
                <td style={{ padding: "14px" }}>{brand.brandId}</td>
                <td>{brand.brandName}</td>
                <td>
                  <button
                    onClick={() => handleEdit(brand)}
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
                    onClick={() => handleDelete(brand.brandId)}
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
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default BrandsAdmin;