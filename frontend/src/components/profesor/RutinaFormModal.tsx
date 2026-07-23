import { useState } from 'react';
import { Modal, Button, Input, Select } from '../ui';
import { rutinaService } from '../../services/rutina.service';
import { useToast } from '../ui/toast';
import { extractErrorMessage } from '../../utils/api.helpers';
import type { RutinaDto } from '../../types/rutina.types';
import type { UsuarioAdminDto } from '../../types/usuario.types';

interface RutinaFormModalProps {
  socios: UsuarioAdminDto[];
  editando: RutinaDto | null;
  onClose: () => void;
  onSaved: () => void;
}

export const RutinaFormModal: React.FC<RutinaFormModalProps> = ({ socios, editando, onClose, onSaved }) => {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    usuarioId: editando?.usuario ? String(editando.usuario.id) : '',
    titulo: editando?.titulo ?? '',
    contenido: editando?.contenido ?? '',
  });
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    setGuardando(true);
    try {
      if (editando) {
        await rutinaService.update(editando.id, { titulo: form.titulo, contenido: form.contenido });
        showToast('Rutina actualizada');
      } else {
        await rutinaService.create({ usuarioId: Number(form.usuarioId), titulo: form.titulo, contenido: form.contenido });
        showToast('Rutina creada');
      }
      onSaved();
      onClose();
    } catch (err) {
      showToast(extractErrorMessage(err, 'No se pudo guardar'), 'error');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={editando ? 'Editar rutina' : 'Nueva rutina'}>
      <div className="flex flex-col gap-4">
        {!editando && (
          <Select
            label="Socio"
            placeholder="Elegí un socio"
            options={socios.map((s) => ({ value: s.id, label: `${s.nombre} ${s.apellido}` }))}
            value={form.usuarioId}
            onChange={(e) => setForm({ ...form, usuarioId: e.target.value })}
          />
        )}
        <Input label="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ej: Full body semana 1" />
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-[0.14em] font-semibold text-muted">Contenido</label>
          <textarea
            value={form.contenido}
            onChange={(e) => setForm({ ...form, contenido: e.target.value })}
            rows={8}
            placeholder="Sentadillas 4x12&#10;Press banca 4x10&#10;..."
            className="w-full bg-graphite border border-outline px-4 py-3 text-sm text-on-surface placeholder:text-muted/50 outline-none focus:border-volt resize-y"
          />
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={guardar} disabled={guardando || !form.usuarioId || !form.titulo || !form.contenido}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
