import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker, Form, Input, InputNumber, Modal, Select, Switch } from 'antd';
import { FileTextOutlined, SaveOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { entrySchema, defaultEntryValues } from '../../validations/entry.schema';
import { CATEGORIES } from '../../constants/categories';
import AppButton from '../common/AppButton';

/**
 * Add/Edit modal. Same schema and same component handle both flows —
 * `initialValues` is null for Add, populated for Edit.
 */
export default function LogEntryForm({ open, onClose, onSubmit, initialValues, submitting }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(entrySchema),
    mode: 'onChange',
    defaultValues: defaultEntryValues,
  });

  useEffect(() => {
    if (open) {
      reset(
        initialValues
          ? {
              description: initialValues.description,
              hours: Number(initialValues.hours),
              entryDate: dayjs(initialValues.entry_date),
              category: initialValues.category,
              isBillable: initialValues.is_billable,
            }
          : defaultEntryValues
      );
    }
  }, [open, initialValues, reset]);

  const submitHandler = (values) => {
    onSubmit({
      description: values.description,
      hours: values.hours,
      entry_date: dayjs(values.entryDate).format('YYYY-MM-DD'),
      category: values.category,
      is_billable: values.isBillable,
    });
  };

  /* Theme-aware input style using CSS variables */
  const inputStyle = {
    backgroundColor: 'var(--bg-base)',
    borderColor: 'var(--border-subtle)',
    color: 'var(--text-primary)',
    borderRadius: 10,
  };

  const inputStyleError = (hasError) => ({
    ...inputStyle,
    borderColor: hasError ? '#ef4444' : 'var(--border-subtle)',
  });

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 18 }}>
          {initialValues ? 'Edit Time Entry' : 'Log New Time Entry'}
        </span>
      }
      footer={null}
      destroyOnClose
      width={440}
      styles={{
        content: {
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        },
        header: {
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-subtle)',
        },
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <Form layout="vertical" onFinish={handleSubmit(submitHandler)} style={{ marginTop: 20 }}>
        <Form.Item
          label={<span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Description</span>}
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description?.message}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                prefix={<FileTextOutlined style={{ color: 'var(--text-muted)' }} />}
                placeholder="e.g. Implemented OAuth login flow"
                style={inputStyleError(errors.description)}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Hours Spent</span>}
          validateStatus={errors.hours ? 'error' : ''}
          help={errors.hours?.message}
        >
          <Controller
            name="hours"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                size="large"
                min={0.1}
                step={0.5}
                addonAfter={<span style={{ color: 'var(--text-secondary)' }}>hrs</span>}
                style={{ width: '100%', ...inputStyleError(errors.hours) }}
                placeholder="e.g. 2.5"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Date</span>}
          validateStatus={errors.entryDate ? 'error' : ''}
          help={errors.entryDate?.message}
        >
          <Controller
            name="entryDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                size="large"
                style={{ width: '100%', ...inputStyleError(errors.entryDate) }}
                format="YYYY-MM-DD"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Category</span>}
          validateStatus={errors.category ? 'error' : ''}
          help={errors.category?.message}
        >
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                size="large"
                placeholder="Select a category"
                style={{ width: '100%' }}
                options={CATEGORIES.map((c) => ({
                  label: c,
                  value: c,
                }))}
              />
            )}
          />
        </Form.Item>

        <Form.Item label={<span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Billable</span>}>
          <Controller
            name="isBillable"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Switch checked={value} onChange={onChange} checkedChildren="Billable" unCheckedChildren="Non-Billable" />
            )}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24, textAlign: 'right' }}>
          <AppButton variant="text" onClick={onClose} style={{ marginRight: 8, color: 'var(--text-secondary)' }}>
            Cancel
          </AppButton>
          <AppButton
            variant="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            className="btn-gradient-primary"
            loading={submitting}
            disabled={!isValid}
            style={{ height: 40, padding: '0 20px', fontSize: 14, fontWeight: 600 }}
          >
            {initialValues ? 'Save Changes' : 'Add Entry'}
          </AppButton>
        </Form.Item>
      </Form>
    </Modal>
  );
}

LogEntryForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  submitting: PropTypes.bool,
};
